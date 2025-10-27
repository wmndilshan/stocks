interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

interface PatternDetection {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
  significance: 'low' | 'medium' | 'high';
  action: 'buy' | 'sell' | 'hold';
}

export class CandlestickPatternDetector {
  private data: CandlestickData[];

  constructor(data: CandlestickData[]) {
    this.data = data;
  }

  // Get the most recent candles
  private getRecentCandles(count: number): CandlestickData[] {
    return this.data.slice(-count);
  }

  // Calculate body size
  private getBodySize(candle: CandlestickData): number {
    return Math.abs(candle.close - candle.open);
  }

  // Calculate upper shadow
  private getUpperShadow(candle: CandlestickData): number {
    return candle.high - Math.max(candle.open, candle.close);
  }

  // Calculate lower shadow
  private getLowerShadow(candle: CandlestickData): number {
    return Math.min(candle.open, candle.close) - candle.low;
  }

  // Check if candle is bullish
  private isBullish(candle: CandlestickData): boolean {
    return candle.close > candle.open;
  }

  // Check if candle is bearish
  private isBearish(candle: CandlestickData): boolean {
    return candle.close < candle.open;
  }

  // Check if candle is doji
  private isDoji(candle: CandlestickData): boolean {
    const bodySize = this.getBodySize(candle);
    const totalRange = candle.high - candle.low;
    return bodySize / totalRange < 0.1;
  }

  // Check if candle has long upper shadow
  private hasLongUpperShadow(candle: CandlestickData): boolean {
    const upperShadow = this.getUpperShadow(candle);
    const bodySize = this.getBodySize(candle);
    return upperShadow > bodySize * 2;
  }

  // Check if candle has long lower shadow
  private hasLongLowerShadow(candle: CandlestickData): boolean {
    const lowerShadow = this.getLowerShadow(candle);
    const bodySize = this.getBodySize(candle);
    return lowerShadow > bodySize * 2;
  }

  // Detect Doji pattern
  private detectDoji(): PatternDetection | null {
    const [current] = this.getRecentCandles(1);
    
    if (this.isDoji(current)) {
      return {
        name: 'Doji',
        type: 'neutral',
        confidence: 0.7,
        description: 'Market indecision, potential reversal signal',
        significance: 'medium',
        action: 'hold'
      };
    }
    return null;
  }

  // Detect Hammer pattern
  private detectHammer(): PatternDetection | null {
    const [current] = this.getRecentCandles(1);
    
    const bodySize = this.getBodySize(current);
    const lowerShadow = this.getLowerShadow(current);
    const upperShadow = this.getUpperShadow(current);
    const totalRange = current.high - current.low;
    
    if (
      lowerShadow > bodySize * 2 &&
      upperShadow < bodySize * 0.1 &&
      bodySize / totalRange < 0.3
    ) {
      return {
        name: 'Hammer',
        type: 'bullish',
        confidence: 0.8,
        description: 'Potential bullish reversal after downtrend',
        significance: 'high',
        action: 'buy'
      };
    }
    return null;
  }

  // Detect Shooting Star pattern
  private detectShootingStar(): PatternDetection | null {
    const [current] = this.getRecentCandles(1);
    
    const bodySize = this.getBodySize(current);
    const upperShadow = this.getUpperShadow(current);
    const lowerShadow = this.getLowerShadow(current);
    const totalRange = current.high - current.low;
    
    if (
      upperShadow > bodySize * 2 &&
      lowerShadow < bodySize * 0.1 &&
      bodySize / totalRange < 0.3
    ) {
      return {
        name: 'Shooting Star',
        type: 'bearish',
        confidence: 0.8,
        description: 'Potential bearish reversal after uptrend',
        significance: 'high',
        action: 'sell'
      };
    }
    return null;
  }

  // Detect Engulfing pattern
  private detectEngulfing(): PatternDetection | null {
    const [previous, current] = this.getRecentCandles(2);
    
    // Bullish Engulfing
    if (
      this.isBearish(previous) &&
      this.isBullish(current) &&
      current.open < previous.close &&
      current.close > previous.open
    ) {
      return {
        name: 'Bullish Engulfing',
        type: 'bullish',
        confidence: 0.85,
        description: 'Strong bullish reversal signal',
        significance: 'high',
        action: 'buy'
      };
    }
    
    // Bearish Engulfing
    if (
      this.isBullish(previous) &&
      this.isBearish(current) &&
      current.open > previous.close &&
      current.close < previous.open
    ) {
      return {
        name: 'Bearish Engulfing',
        type: 'bearish',
        confidence: 0.85,
        description: 'Strong bearish reversal signal',
        significance: 'high',
        action: 'sell'
      };
    }
    
    return null;
  }

  // Detect Morning Star pattern
  private detectMorningStar(): PatternDetection | null {
    const [first, second, third] = this.getRecentCandles(3);
    
    if (
      this.isBearish(first) &&
      this.getBodySize(second) < this.getBodySize(first) * 0.3 &&
      this.isBullish(third) &&
      third.close > (first.open + first.close) / 2
    ) {
      return {
        name: 'Morning Star',
        type: 'bullish',
        confidence: 0.9,
        description: 'Very strong bullish reversal pattern',
        significance: 'high',
        action: 'buy'
      };
    }
    return null;
  }

  // Detect Evening Star pattern
  private detectEveningStar(): PatternDetection | null {
    const [first, second, third] = this.getRecentCandles(3);
    
    if (
      this.isBullish(first) &&
      this.getBodySize(second) < this.getBodySize(first) * 0.3 &&
      this.isBearish(third) &&
      third.close < (first.open + first.close) / 2
    ) {
      return {
        name: 'Evening Star',
        type: 'bearish',
        confidence: 0.9,
        description: 'Very strong bearish reversal pattern',
        significance: 'high',
        action: 'sell'
      };
    }
    return null;
  }

  // Detect Three White Soldiers
  private detectThreeWhiteSoldiers(): PatternDetection | null {
    const [first, second, third] = this.getRecentCandles(3);
    
    if (
      this.isBullish(first) &&
      this.isBullish(second) &&
      this.isBullish(third) &&
      second.close > first.close &&
      third.close > second.close &&
      second.open > first.open &&
      third.open > second.open
    ) {
      return {
        name: 'Three White Soldiers',
        type: 'bullish',
        confidence: 0.85,
        description: 'Strong bullish continuation pattern',
        significance: 'high',
        action: 'buy'
      };
    }
    return null;
  }

  // Detect Three Black Crows
  private detectThreeBlackCrows(): PatternDetection | null {
    const [first, second, third] = this.getRecentCandles(3);
    
    if (
      this.isBearish(first) &&
      this.isBearish(second) &&
      this.isBearish(third) &&
      second.close < first.close &&
      third.close < second.close &&
      second.open < first.open &&
      third.open < second.open
    ) {
      return {
        name: 'Three Black Crows',
        type: 'bearish',
        confidence: 0.85,
        description: 'Strong bearish continuation pattern',
        significance: 'high',
        action: 'sell'
      };
    }
    return null;
  }

  // Detect Piercing Line
  private detectPiercingLine(): PatternDetection | null {
    const [previous, current] = this.getRecentCandles(2);
    
    if (
      this.isBearish(previous) &&
      this.isBullish(current) &&
      current.open < previous.low &&
      current.close > (previous.open + previous.close) / 2 &&
      current.close < previous.open
    ) {
      return {
        name: 'Piercing Line',
        type: 'bullish',
        confidence: 0.75,
        description: 'Bullish reversal pattern',
        significance: 'medium',
        action: 'buy'
      };
    }
    return null;
  }

  // Detect Dark Cloud Cover
  private detectDarkCloudCover(): PatternDetection | null {
    const [previous, current] = this.getRecentCandles(2);
    
    if (
      this.isBullish(previous) &&
      this.isBearish(current) &&
      current.open > previous.high &&
      current.close < (previous.open + previous.close) / 2 &&
      current.close > previous.open
    ) {
      return {
        name: 'Dark Cloud Cover',
        type: 'bearish',
        confidence: 0.75,
        description: 'Bearish reversal pattern',
        significance: 'medium',
        action: 'sell'
      };
    }
    return null;
  }

  // Main detection method
  public detectPatterns(): PatternDetection[] {
    if (this.data.length < 3) {
      return [];
    }

    const patterns: PatternDetection[] = [];
    const detectionMethods = [
      () => this.detectDoji(),
      () => this.detectHammer(),
      () => this.detectShootingStar(),
      () => this.detectEngulfing(),
      () => this.detectMorningStar(),
      () => this.detectEveningStar(),
      () => this.detectThreeWhiteSoldiers(),
      () => this.detectThreeBlackCrows(),
      () => this.detectPiercingLine(),
      () => this.detectDarkCloudCover()
    ];

    for (const detect of detectionMethods) {
      try {
        const pattern = detect();
        if (pattern) {
          patterns.push(pattern);
        }
      } catch (error) {
        console.error('Error detecting pattern:', error);
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  // Get pattern summary
  public getPatternSummary(): {
    bullishPatterns: number;
    bearishPatterns: number;
    neutralPatterns: number;
    overallSentiment: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
  } {
    const patterns = this.detectPatterns();
    
    const bullishPatterns = patterns.filter(p => p.type === 'bullish').length;
    const bearishPatterns = patterns.filter(p => p.type === 'bearish').length;
    const neutralPatterns = patterns.filter(p => p.type === 'neutral').length;
    
    let overallSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 0;
    
    if (bullishPatterns > bearishPatterns) {
      overallSentiment = 'bullish';
      confidence = patterns.filter(p => p.type === 'bullish').reduce((sum, p) => sum + p.confidence, 0) / bullishPatterns;
    } else if (bearishPatterns > bullishPatterns) {
      overallSentiment = 'bearish';
      confidence = patterns.filter(p => p.type === 'bearish').reduce((sum, p) => sum + p.confidence, 0) / bearishPatterns;
    }
    
    return {
      bullishPatterns,
      bearishPatterns,
      neutralPatterns,
      overallSentiment,
      confidence: Math.round(confidence * 100) / 100
    };
  }
}

// Export types
export type { CandlestickData, PatternDetection };
