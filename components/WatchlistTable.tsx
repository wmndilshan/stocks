'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MoreHorizontal, Trash2, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { getStockQuote } from '@/lib/actions/finnhub.actions';
import { toast } from 'sonner';
import type { WatchlistItem } from '@/database/models/watchlist.model';

interface WatchlistTableProps {
  watchlist: WatchlistItem[];
  userId: string;
}

interface WatchlistItemWithPrice extends WatchlistItem {
  currentPrice?: number;
  change?: number;
  changePercent?: number;
}

export default function WatchlistTable({ watchlist, userId }: WatchlistTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [watchlistWithPrices, setWatchlistWithPrices] = useState<WatchlistItemWithPrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const updatedWatchlist = await Promise.all(
        watchlist.map(async (item) => {
          try {
            const quote = await getStockQuote(item.symbol);
            return {
              ...item,
              currentPrice: quote?.c,
              change: quote?.d,
              changePercent: quote?.dp,
            };
          } catch (error) {
            console.error(`Error fetching price for ${item.symbol}:`, error);
            return item;
          }
        })
      );
      setWatchlistWithPrices(updatedWatchlist);
      setPricesLoading(false);
    };

    if (watchlist.length > 0) {
      fetchPrices();
    } else {
      setPricesLoading(false);
    }
  }, [watchlist]);

  if (pricesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (watchlistWithPrices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Your watchlist is empty</h3>
            <p className="text-muted-foreground">Add stocks you're interested in to track their performance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRemoveFromWatchlist = async (symbol: string) => {
    setIsLoading(symbol);
    try {
      const result = await removeFromWatchlist(userId, symbol);
      if (result.success) {
        toast.success(result.message);
        setWatchlistWithPrices(prev => prev.filter(item => item.symbol !== symbol));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Watchlist
            <Badge variant="outline">{watchlistWithPrices.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {watchlistWithPrices.map((item) => {
              const isPositive = (item.change || 0) >= 0;

              return (
                <div key={item.symbol} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Link 
                        href={`/stocks/${item.symbol}`}
                        className="hover:underline"
                      >
                        <h3 className="font-semibold text-lg">{item.symbol}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        {item.currentPrice ? (
                          `$${item.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          'N/A'
                        )}
                      </div>
                      {item.change !== undefined && item.changePercent !== undefined && (
                        <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {isPositive ? '+' : ''}${item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isLoading === item.symbol}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/alerts?symbol=${item.symbol}&company=${encodeURIComponent(item.company)}`}>
                            <Bell className="h-4 w-4 mr-2" />
                            Create Alert
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveFromWatchlist(item.symbol)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
