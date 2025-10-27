'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getStockQuote } from '@/lib/actions/finnhub.actions';

interface MarketIndex {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

const MAJOR_INDICES = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ 100' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'IWM', name: 'Russell 2000' },
];

export default function MarketSummary() {
  const [indices, setIndices] = useState<MarketIndex[]>(MAJOR_INDICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const updatedIndices = await Promise.all(
          MAJOR_INDICES.map(async (index) => {
            try {
              const quote = await getStockQuote(index.symbol);
              return {
                ...index,
                price: quote?.c,
                change: quote?.d,
                changePercent: quote?.dp,
              };
            } catch (error) {
              console.error(`Error fetching data for ${index.symbol}:`, error);
              return index;
            }
          })
        );
        setIndices(updatedIndices);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Market Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indices.map((index) => {
            const isPositive = (index.change || 0) >= 0;
            return (
              <div key={index.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{index.name}</div>
                  <div className="text-sm text-muted-foreground">{index.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {index.price ? `$${index.price.toFixed(2)}` : 'N/A'}
                  </div>
                  {index.change !== undefined && index.changePercent !== undefined && (
                    <div className={`text-sm flex items-center justify-end gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositive ? '+' : ''}${index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
