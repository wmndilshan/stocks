'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bell, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { CandlestickPatternDetector, CandlestickData, PatternDetection } from '@/lib/candlestick-detector';

interface PatternDetectionPanelProps {
  symbol: string;
  onPatternAlert?: (pattern: PatternDetection) => void;
}

export default function PatternDetectionPanel({ symbol, onPatternAlert }: PatternDetectionPanelProps) {
  const [patterns, setPatterns] = useState<PatternDetection[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    detectPatterns();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        detectPatterns();
      }, 60000); // Refresh every minute
      
      return () => clearInterval(interval);
    }
  }, [symbol, autoRefresh]);

  const detectPatterns = async () => {
    setLoading(true);
    try {
      // Simulate fetching candlestick data - replace with actual API call
      const mockCandlestickData: CandlestickData[] = generateMockCandlestickData();
      
      const detector = new CandlestickPatternDetector(mockCandlestickData);
      const detectedPatterns = detector.detectPatterns();
      const patternSummary = detector.getPatternSummary();
      
      setPatterns(detectedPatterns);
      setSummary(patternSummary);
      setLastUpdate(new Date());
      
      // Alert for high significance patterns
      detectedPatterns.forEach(pattern => {
        if (pattern.significance === 'high' && onPatternAlert) {
          onPatternAlert(pattern);
        }
      });
      
    } catch (error) {
      console.error('Error detecting patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockCandlestickData = (): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let basePrice = 175;
    
    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * 10;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      
      data.push({
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000) + 500000,
        timestamp: new Date(Date.now() - (49 - i) * 24 * 60 * 60 * 1000).toISOString()
      });
      
      basePrice = close;
    }
    
    return data;
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-600 bg-green-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pattern Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Pattern Analysis - {symbol}</span>
              </CardTitle>
              <CardDescription>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Bell className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-green-600' : ''}`} />
                Auto Alerts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={detectPatterns}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Sentiment</span>
                  <Badge className={getSentimentColor(summary.overallSentiment)}>
                    {summary.overallSentiment.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className="font-medium">{(summary.confidence * 100).toFixed(0)}%</span>
                </div>
                <Progress value={summary.confidence * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bullish Patterns</span>
                  <span className="font-medium text-green-600">{summary.bullishPatterns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bearish Patterns</span>
                  <span className="font-medium text-red-600">{summary.bearishPatterns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Neutral Patterns</span>
                  <span className="font-medium text-gray-600">{summary.neutralPatterns}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Patterns</CardTitle>
          <CardDescription>
            Recent candlestick patterns identified in {symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Analyzing patterns...</span>
            </div>
          ) : patterns.length > 0 ? (
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {getPatternIcon(pattern.type)}
                      <div>
                        <h3 className="font-medium">{pattern.name}</h3>
                        <p className="text-sm text-gray-600">{pattern.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getSignificanceIcon(pattern.significance)}
                      <Badge className={getPatternColor(pattern.type)}>
                        {pattern.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Confidence:</span>
                      <div className="font-medium">{(pattern.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Significance:</span>
                      <div className="font-medium capitalize">{pattern.significance}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Action:</span>
                      <div className={`font-medium capitalize ${
                        pattern.action === 'buy' ? 'text-green-600' : 
                        pattern.action === 'sell' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {pattern.action}
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={pattern.confidence * 100} className="h-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Patterns Detected</h3>
              <p className="text-gray-600">
                No significant candlestick patterns found in recent data for {symbol}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pattern Education */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Guide</CardTitle>
          <CardDescription>
            Learn about common candlestick patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Bullish Patterns</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Hammer - Potential reversal after downtrend</li>
                <li>• Bullish Engulfing - Strong reversal signal</li>
                <li>• Morning Star - Very strong reversal</li>
                <li>• Piercing Line - Moderate reversal signal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">Bearish Patterns</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Shooting Star - Potential reversal after uptrend</li>
                <li>• Bearish Engulfing - Strong reversal signal</li>
                <li>• Evening Star - Very strong reversal</li>
                <li>• Dark Cloud Cover - Moderate reversal signal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
