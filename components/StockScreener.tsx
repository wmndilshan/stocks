'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';
import { getStockQuote } from '@/lib/actions/finnhub.actions';

interface ScreenerFilters {
  minPrice: number | null;
  maxPrice: number | null;
  minChange: number | null;
  maxChange: number | null;
  sector: string;
}

interface ScreenedStock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function StockScreener() {
  const [filters, setFilters] = useState<ScreenerFilters>({
    minPrice: null,
    maxPrice: null,
    minChange: null,
    maxChange: null,
    sector: 'all',
  });
  const [results, setResults] = useState<ScreenedStock[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll screen from popular stocks
      const screened: ScreenedStock[] = [];
      
      for (const symbol of POPULAR_STOCK_SYMBOLS.slice(0, 20)) {
        try {
          const quote = await getStockQuote(symbol);
          if (quote) {
            const meetsFilters = 
              (!filters.minPrice || quote.c >= filters.minPrice) &&
              (!filters.maxPrice || quote.c <= filters.maxPrice) &&
              (!filters.minChange || quote.d >= filters.minChange) &&
              (!filters.maxChange || quote.d <= filters.maxChange);

            if (meetsFilters) {
              screened.push({
                symbol,
                price: quote.c,
                change: quote.d,
                changePercent: quote.dp,
              });
            }
          }
        } catch (error) {
          console.error(`Error screening ${symbol}:`, error);
        }
      }

      setResults(screened.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Error screening stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      minChange: null,
      maxChange: null,
      sector: 'all',
    });
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Stock Screener
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price ($)</Label>
              <Input
                id="minPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minPrice: e.target.value ? parseFloat(e.target.value) : null 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxPrice: e.target.value ? parseFloat(e.target.value) : null 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minChange">Min Change ($)</Label>
              <Input
                id="minChange"
                type="number"
                step="0.01"
                placeholder="-10.00"
                value={filters.minChange || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minChange: e.target.value ? parseFloat(e.target.value) : null 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxChange">Max Change ($)</Label>
              <Input
                id="maxChange"
                type="number"
                step="0.01"
                placeholder="10.00"
                value={filters.maxChange || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxChange: e.target.value ? parseFloat(e.target.value) : null 
                }))}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleFilter} disabled={loading}>
              {loading ? 'Screening...' : 'Screen Stocks'}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Results
              <Badge variant="outline">{results.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{stock.symbol}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-semibold">
                        {isPositive ? '+' : ''}${stock.change.toFixed(2)}
                      </span>
                      <span className="text-sm">
                        ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
