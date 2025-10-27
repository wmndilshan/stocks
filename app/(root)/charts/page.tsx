'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';

const popularSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.50', change: '+2.35%' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$340.75', change: '+1.20%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$135.25', change: '-0.45%' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$145.80', change: '+0.85%' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$220.45', change: '+3.20%' },
  { symbol: 'META', name: 'Meta Platforms', price: '$485.25', change: '+1.75%' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$875.30', change: '+4.20%' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: '$155.25', change: '+0.65%' }
];

function ChartSearchFormInline() {
  const [symbol, setSymbol] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      router.push(`/chart/${symbol.toUpperCase().trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input 
        placeholder="Enter stock symbol (e.g., AAPL)" 
        className="flex-1"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <Button type="submit">
        View Chart
      </Button>
    </form>
  );
}

export default function ChartsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Charts</h1>
          <p className="text-muted-foreground">
            Advanced charting with pattern detection and technical analysis
          </p>
        </div>
      </div>

      {/* Quick Chart Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Quick Chart Access</span>
          </CardTitle>
          <CardDescription>
            Enter a stock symbol to view its advanced chart
          </CardDescription>
        </CardHeader>        <CardContent>
          <ChartSearchFormInline />
        </CardContent>
      </Card>

      {/* Popular Stocks */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Stocks</CardTitle>
          <CardDescription>
            Click on any stock to view its detailed chart with pattern analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularSymbols.map((stock) => (
              <Link key={stock.symbol} href={`/chart/${stock.symbol}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stock.price}</span>
                      <span className={`text-sm ${
                        stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Pattern Detection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Automatic candlestick pattern recognition with real-time alerts for bullish and bearish signals.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Technical Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Comprehensive technical indicators including RSI, MACD, Bollinger Bands, and moving averages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <span>Real-time Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Live market data with multiple timeframes and advanced charting tools powered by TradingView.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
