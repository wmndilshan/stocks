'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatternDetectionPanel from '@/components/PatternDetectionPanel';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Maximize2,
  Star,
  Bell,
  Share2
} from 'lucide-react';

interface TradingViewChartPageProps {
  symbol: string;
}

interface StockQuote {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  high52Week: number;
  low52Week: number;
}

interface TechnicalIndicator {
  name: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  value: string;
  description: string;
}

export default function TradingViewChartPage({ symbol }: TradingViewChartPageProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [technicals, setTechnicals] = useState<TechnicalIndicator[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');  const [chartType, setChartType] = useState('candlestick');

  const loadTradingViewWidget = useCallback(() => {
    if (chartContainerRef.current) {
      // Clear previous widget
      chartContainerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `NASDAQ:${symbol}`,
        interval: timeframe,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: chartType === 'candlestick' ? '1' : '2',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        withdateranges: true,
        range: timeframe,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        studies: [
          'Volume@tv-basicstudies',
          'MACD@tv-basicstudies',
          'RSI@tv-basicstudies',
          'BB@tv-basicstudies'
        ],
        container_id: 'tradingview_chart'
      });
      
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'tradingview_chart';
      widgetContainer.style.height = isFullscreen ? '100vh' : '600px';
      
      chartContainerRef.current.appendChild(widgetContainer);
      chartContainerRef.current.appendChild(script);    }
  }, [symbol, timeframe, chartType, isFullscreen]);

  useEffect(() => {
    // Load TradingView widget
    loadTradingViewWidget();
    
    // Fetch stock data
    fetchStockData();
    
    // Fetch technical indicators
    fetchTechnicalIndicators();
  }, [symbol, loadTradingViewWidget]);

  const fetchStockData = async () => {
    try {
      // Simulate stock data - replace with actual API call
      const mockQuote: StockQuote = {
        price: 175.50,
        change: 2.35,
        changePercent: 1.36,
        volume: 45678900,
        marketCap: 2800000000000,
        peRatio: 24.5,
        high52Week: 198.23,
        low52Week: 124.17
      };
      
      setQuote(mockQuote);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const fetchTechnicalIndicators = async () => {
    try {
      // Simulate technical indicators - replace with actual API call
      const mockTechnicals: TechnicalIndicator[] = [
        {
          name: 'RSI (14)',
          signal: 'NEUTRAL',
          value: '58.2',
          description: 'Relative Strength Index indicates neutral momentum'
        },
        {
          name: 'MACD',
          signal: 'BUY',
          value: '1.23',
          description: 'MACD line above signal line, bullish trend'
        },
        {
          name: 'Bollinger Bands',
          signal: 'NEUTRAL',
          value: 'Middle',
          description: 'Price trading near middle band'
        },
        {
          name: 'SMA (50)',
          signal: 'BUY',
          value: '170.25',
          description: 'Price above 50-day moving average'
        },
        {
          name: 'EMA (20)',
          signal: 'BUY',
          value: '173.80',
          description: 'Price above 20-day exponential moving average'
        },
        {
          name: 'Stochastic',
          signal: 'SELL',
          value: '78.5',
          description: 'Stochastic oscillator in overbought territory'
        }
      ];
      
      setTechnicals(mockTechnicals);
    } catch (error) {
      console.error('Error fetching technical indicators:', error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      loadTradingViewWidget();
    }, 100);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    setTimeout(() => {
      loadTradingViewWidget();
    }, 100);
  };

  const handleChartTypeChange = (newType: string) => {
    setChartType(newType);
    setTimeout(() => {
      loadTradingViewWidget();
    }, 100);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100';
      case 'NEUTRAL': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
          <h1 className="text-xl font-bold">{symbol} - Advanced Chart</h1>
          <Button onClick={toggleFullscreen} variant="outline" size="sm">
            Exit Fullscreen
          </Button>
        </div>
        <div ref={chartContainerRef} className="h-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{symbol}</h1>
          {quote && (
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-2xl font-bold">${quote.price.toFixed(2)}</span>
              <span className={`flex items-center ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {quote.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Watchlist
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alert
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M'].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button
            variant={chartType === 'candlestick' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChartTypeChange('candlestick')}
          >
            Candlestick
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChartTypeChange('line')}
          >
            Line
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div ref={chartContainerRef} style={{ height: '600px' }} />
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Key Stats */}
          {quote && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volume</span>
                  <span className="font-medium">{quote.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Market Cap</span>
                  <span className="font-medium">${(quote.marketCap / 1e12).toFixed(2)}T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P/E Ratio</span>
                  <span className="font-medium">{quote.peRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">52W High</span>
                  <span className="font-medium">${quote.high52Week}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">52W Low</span>
                  <span className="font-medium">${quote.low52Week}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicals.map((indicator, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{indicator.name}</span>
                      <Badge className={getSignalColor(indicator.signal)}>
                        {indicator.signal}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">{indicator.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                <DollarSign className="h-4 w-4 mr-2" />
                Buy {symbol}
              </Button>
              <Button className="w-full" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Sell {symbol}
              </Button>
              <Button className="w-full" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Detailed company information, business description, and key metrics will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Recent news and analysis related to {symbol} will be shown here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Income statement, balance sheet, and cash flow data will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>        <TabsContent value="patterns" className="space-y-4">
          <PatternDetectionPanel 
            symbol={symbol}
            onPatternAlert={(pattern) => {
              // Handle pattern alerts - could show notification, send email, etc.
              console.log('Pattern Alert:', pattern);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
