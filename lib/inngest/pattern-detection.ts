import { inngest } from './client';
import { CandlestickPatternDetector, CandlestickData, PatternDetection } from '@/lib/candlestick-detector';
import { sendPatternAlert } from '@/lib/nodemailer/templates';

// Function to fetch candlestick data from Finnhub API
async function fetchCandlestickData(symbol: string): Promise<CandlestickData[]> {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  const baseUrl = process.env.FINNHUB_BASE_URL;
  
  if (!apiKey || !baseUrl) {
    throw new Error('Missing Finnhub API configuration');
  }

  try {
    // Get the current timestamp and 30 days ago
    const to = Math.floor(Date.now() / 1000);
    const from = to - (30 * 24 * 60 * 60); // 30 days ago

    const response = await fetch(
      `${baseUrl}/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.s !== 'ok') {
      throw new Error(`API returned error status: ${data.s}`);
    }

    // Transform the data into our format
    const candlestickData: CandlestickData[] = [];
    for (let i = 0; i < data.c.length; i++) {
      candlestickData.push({
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
        timestamp: new Date(data.t[i] * 1000).toISOString()
      });
    }

    return candlestickData;
  } catch (error) {
    console.error(`Error fetching candlestick data for ${symbol}:`, error);
    throw error;
  }
}

// Function to get watchlist symbols for pattern detection
async function getWatchlistSymbols(): Promise<string[]> {
  // This would typically fetch from your database
  // For now, return a default set of popular symbols
  return [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
    'META', 'NVDA', 'JPM', 'BAC', 'WMT'
  ];
}

// Function to get users who want pattern alerts
async function getUsersForPatternAlerts(): Promise<Array<{ email: string; userId: string }>> {
  // This would typically fetch from your database
  // For now, return a mock user for testing
  return [
    { email: 'user@example.com', userId: 'test-user-id' }
  ];
}

export const patternDetectionRunner = inngest.createFunction(
  { id: 'pattern-detection-runner' },
  { cron: '0 */4 * * *' }, // Run every 4 hours
  async ({ step }) => {
    console.log('Starting pattern detection run...');

    // Step 1: Get watchlist symbols
    const symbols = await step.run('get-watchlist-symbols', async () => {
      return await getWatchlistSymbols();
    });

    // Step 2: Get users for alerts
    const users = await step.run('get-users-for-alerts', async () => {
      return await getUsersForPatternAlerts();
    });    // Step 3: Process each symbol
    const allDetections: Array<{
      symbol: string;
      patterns: PatternDetection[];
      summary: {
        bullishPatterns: number;
        bearishPatterns: number;
        neutralPatterns: number;
        overallSentiment: 'bullish' | 'bearish' | 'neutral';
        confidence: number;
      };
    }> = [];

    for (const symbol of symbols) {
      try {
        const detection = await step.run(`detect-patterns-${symbol}`, async () => {
          console.log(`Analyzing patterns for ${symbol}...`);
          
          // Fetch candlestick data
          const candlestickData = await fetchCandlestickData(symbol);
          
          if (candlestickData.length < 3) {
            console.log(`Insufficient data for ${symbol}`);
            return null;
          }

          // Create detector and analyze patterns
          const detector = new CandlestickPatternDetector(candlestickData);
          const patterns = detector.detectPatterns();
          const summary = detector.getPatternSummary();

          return {
            symbol,
            patterns,
            summary
          };
        });

        if (detection) {
          allDetections.push(detection);
        }
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error);
      }
    }

    // Step 4: Filter significant patterns and send alerts
    const significantDetections = allDetections.filter(detection => 
      detection.patterns.some(pattern => 
        pattern.significance === 'high' && pattern.confidence > 0.7
      )
    );

    if (significantDetections.length > 0) {
      await step.run('send-pattern-alerts', async () => {
        for (const user of users) {
          try {
            console.log(`Sending pattern alerts to ${user.email}...`);
            
            // Group patterns by type for better email organization
            const bullishPatterns: Array<{ symbol: string; pattern: PatternDetection }> = [];
            const bearishPatterns: Array<{ symbol: string; pattern: PatternDetection }> = [];

            significantDetections.forEach(detection => {
              detection.patterns
                .filter(pattern => pattern.significance === 'high' && pattern.confidence > 0.7)
                .forEach(pattern => {
                  if (pattern.type === 'bullish') {
                    bullishPatterns.push({ symbol: detection.symbol, pattern });
                  } else if (pattern.type === 'bearish') {
                    bearishPatterns.push({ symbol: detection.symbol, pattern });
                  }
                });
            });

            if (bullishPatterns.length > 0 || bearishPatterns.length > 0) {
              await sendPatternAlert({
                to: user.email,
                bullishPatterns,
                bearishPatterns,
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error(`Error sending alert to ${user.email}:`, error);
          }
        }
      });
    }

    console.log(`Pattern detection completed. Processed ${symbols.length} symbols, found ${significantDetections.length} significant patterns.`);

    return {
      processedSymbols: symbols.length,
      significantPatterns: significantDetections.length,
      detections: allDetections
    };
  }
);

// Function to manually trigger pattern detection for a specific symbol
export const detectPatternForSymbol = inngest.createFunction(
  { id: 'detect-pattern-for-symbol' },
  { event: 'pattern/detect-symbol' },
  async ({ event, step }) => {
    const { symbol, userId } = event.data;

    console.log(`Manual pattern detection requested for ${symbol} by user ${userId}`);

    const detection = await step.run('analyze-symbol', async () => {
      try {
        // Fetch candlestick data
        const candlestickData = await fetchCandlestickData(symbol);
        
        if (candlestickData.length < 3) {
          throw new Error(`Insufficient data for ${symbol}`);
        }

        // Create detector and analyze patterns
        const detector = new CandlestickPatternDetector(candlestickData);
        const patterns = detector.detectPatterns();
        const summary = detector.getPatternSummary();

        return {
          symbol,
          patterns,
          summary,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
        throw error;
      }
    });

    return detection;
  }
);

// Real-time pattern detection for active trading
export const realtimePatternDetection = inngest.createFunction(
  { id: 'realtime-pattern-detection' },
  { cron: '*/15 * * * *' }, // Run every 15 minutes during market hours
  async ({ step }) => {
    console.log('Starting real-time pattern detection...');

    // Get market hours status (simplified - you might want to add proper market hours logic)
    const now = new Date();
    const hour = now.getHours();
    const isMarketHours = hour >= 9 && hour <= 16; // 9 AM to 4 PM EST (simplified)

    if (!isMarketHours) {
      console.log('Market is closed, skipping real-time detection');
      return { status: 'skipped', reason: 'market-closed' };
    }

    // Get high-priority symbols (most actively traded or user favorites)
    const prioritySymbols = await step.run('get-priority-symbols', async () => {
      return ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA']; // Top 5 for real-time monitoring
    });

    const realtimeDetections: Array<{
      symbol: string;
      patterns: PatternDetection[];
      timestamp: string;
    }> = [];

    for (const symbol of prioritySymbols) {
      try {
        const detection = await step.run(`realtime-detect-${symbol}`, async () => {
          // For real-time, we might use intraday data (1-hour or 15-minute candles)
          const candlestickData = await fetchCandlestickData(symbol);
          
          if (candlestickData.length < 3) return null;

          const detector = new CandlestickPatternDetector(candlestickData);
          const patterns = detector.detectPatterns();

          // Only return if there are high-confidence patterns
          const significantPatterns = patterns.filter(p => 
            p.confidence > 0.8 && p.significance === 'high'
          );

          if (significantPatterns.length > 0) {
            return {
              symbol,
              patterns: significantPatterns,
              timestamp: new Date().toISOString()
            };
          }

          return null;
        });

        if (detection) {
          realtimeDetections.push(detection);
        }
      } catch (error) {
        console.error(`Real-time detection error for ${symbol}:`, error);
      }
    }

    // Send immediate alerts for real-time patterns
    if (realtimeDetections.length > 0) {
      await step.run('send-realtime-alerts', async () => {
        const users = await getUsersForPatternAlerts();
        
        for (const user of users) {
          try {
            // Send immediate notification for real-time patterns
            await sendPatternAlert({
              to: user.email,              bullishPatterns: realtimeDetections
                .filter(d => d.patterns.some((p: PatternDetection) => p.type === 'bullish'))
                .flatMap(d => d.patterns.filter((p: PatternDetection) => p.type === 'bullish').map((p: PatternDetection) => ({ symbol: d.symbol, pattern: p }))),              bearishPatterns: realtimeDetections
                .filter(d => d.patterns.some((p: PatternDetection) => p.type === 'bearish'))
                .flatMap(d => d.patterns.filter((p: PatternDetection) => p.type === 'bearish').map((p: PatternDetection) => ({ symbol: d.symbol, pattern: p }))),
              timestamp: new Date().toISOString(),
              isRealtime: true
            });
          } catch (error) {
            console.error(`Error sending real-time alert to ${user.email}:`, error);
          }
        }
      });
    }

    return {
      status: 'completed',
      processedSymbols: prioritySymbols.length,
      patternsFound: realtimeDetections.length,
      detections: realtimeDetections
    };
  }
);
