'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { removePosition } from '@/lib/actions/portfolio.actions';
import { toast } from 'sonner';
import type { PortfolioPosition } from '@/database/models/portfolio.model';

interface PortfolioTableProps {
  positions: PortfolioPosition[];
  userId: string;
}

export default function PortfolioTable({ positions, userId }: PortfolioTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (positions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No positions yet</h3>
            <p className="text-muted-foreground">Start by adding your first transaction</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRemovePosition = async (symbol: string) => {
    setIsLoading(symbol);
    try {
      const result = await removePosition(userId, symbol);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to remove position');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {positions.map((position) => {
        const currentValue = position.quantity * position.currentPrice;
        const costBasis = position.quantity * position.averageCost;
        const gainLoss = currentValue - costBasis;
        const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
        const isPositive = gainLoss >= 0;

        return (
          <Card key={position.symbol} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/stocks/${position.symbol}`}
                    className="hover:underline"
                  >
                    <CardTitle className="text-lg">{position.symbol}</CardTitle>
                  </Link>
                  <Badge variant="outline">{position.company}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={isLoading === position.symbol}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRemovePosition(position.symbol)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Position
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-lg font-semibold">{position.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-semibold">
                    ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Value</p>
                  <p className="text-lg font-semibold">
                    ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gain/Loss</p>
                  <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-lg font-semibold">
                      {isPositive ? '+' : ''}${gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm">
                      ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>Avg Cost: ${position.averageCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span>Cost Basis: ${costBasis.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
