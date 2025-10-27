'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Gauge } from 'lucide-react';

interface SentimentData {
  fearGreedIndex: number;
  vixLevel: number;
  marketTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentiment: 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
}

export default function MarketSentiment() {
  const [sentiment, setSentiment] = useState<SentimentData>({
    fearGreedIndex: 65,
    vixLevel: 18.5,
    marketTrend: 'BULLISH',
    sentiment: 'GREED'
  });

  const getSentimentLabel = (index: number): SentimentData['sentiment'] => {
    if (index <= 20) return 'EXTREME_FEAR';
    if (index <= 40) return 'FEAR';
    if (index <= 60) return 'NEUTRAL';
    if (index <= 80) return 'GREED';
    return 'EXTREME_GREED';
  };

  const getSentimentColor = (sentiment: SentimentData['sentiment']) => {
    switch (sentiment) {
      case 'EXTREME_FEAR': return 'bg-red-600 text-white';
      case 'FEAR': return 'bg-red-400 text-white';
      case 'NEUTRAL': return 'bg-gray-500 text-white';
      case 'GREED': return 'bg-green-400 text-white';
      case 'EXTREME_GREED': return 'bg-green-600 text-white';
    }
  };

  const getVixColor = (vix: number) => {
    if (vix > 30) return 'text-red-600';
    if (vix > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Market Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fear & Greed Index */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fear & Greed Index</span>
            <Badge className={getSentimentColor(sentiment.sentiment)}>
              {sentiment.sentiment.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Extreme Fear</span>
              <span className="font-bold">{sentiment.fearGreedIndex}</span>
              <span>Extreme Greed</span>
            </div>
            <div className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full h-3 relative">
              <div
                className="absolute top-0 h-3 w-1 bg-black rounded-full transform -translate-x-0.5"
                style={{ left: `${sentiment.fearGreedIndex}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* VIX Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">VIX (Volatility Index)</span>
            <span className={`font-bold ${getVixColor(sentiment.vixLevel)}`}>
              {sentiment.vixLevel.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {sentiment.vixLevel > 30 ? 'High Volatility' : 
             sentiment.vixLevel > 20 ? 'Moderate Volatility' : 'Low Volatility'}
          </div>
        </div>

        {/* Market Trend */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Trend</span>
            <div className="flex items-center gap-1">
              {sentiment.marketTrend === 'BULLISH' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : sentiment.marketTrend === 'BEARISH' ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <Activity className="h-4 w-4 text-gray-600" />
              )}
              <span className={`font-medium ${
                sentiment.marketTrend === 'BULLISH' ? 'text-green-600' :
                sentiment.marketTrend === 'BEARISH' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {sentiment.marketTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Market Indicators */}
        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-semibold">Key Indicators</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Put/Call Ratio:</span>
              <span className="font-medium">0.85</span>
            </div>
            <div className="flex justify-between">
              <span>CBOE Equity:</span>
              <span className="font-medium">1.15</span>
            </div>
            <div className="flex justify-between">
              <span>High-Low Index:</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span>McClellan:</span>
              <span className="font-medium">+45</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Updated every 15 minutes during market hours
        </div>
      </CardContent>
    </Card>
  );
}
