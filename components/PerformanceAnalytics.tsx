'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Percent, DollarSign } from 'lucide-react';
import { getPortfolio } from '@/lib/actions/portfolio.actions';

interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  bestPerformer: {
    symbol: string;
    return: number;
    returnPercent: number;
  } | null;
  worstPerformer: {
    symbol: string;
    return: number;
    returnPercent: number;
  } | null;
  winLossRatio: number;
  avgReturnPerPosition: number;
}

interface PerformanceAnalyticsProps {
  userId: string;
}

export default function PerformanceAnalytics({ userId }: PerformanceAnalyticsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        const portfolio = await getPortfolio(userId);
        
        if (portfolio.length === 0) {
          setMetrics(null);
          setLoading(false);
          return;
        }

        let totalReturn = 0;
        let totalCost = 0;
        let dayChange = 0;
        let winningPositions = 0;
        let bestPerformer: PerformanceMetrics['bestPerformer'] = null;
        let worstPerformer: PerformanceMetrics['worstPerformer'] = null;

        portfolio.forEach(position => {
          const currentValue = position.quantity * position.currentPrice;
          const costBasis = position.quantity * position.averageCost;
          const positionReturn = currentValue - costBasis;
          const positionReturnPercent = costBasis > 0 ? (positionReturn / costBasis) * 100 : 0;

          totalReturn += positionReturn;
          totalCost += costBasis;

          // Simple day change calculation (using current price as proxy)
          const dailyChange = position.quantity * (position.currentPrice * 0.01); // Assume 1% daily change for demo
          dayChange += dailyChange;

          if (positionReturn > 0) {
            winningPositions++;
          }

          // Track best and worst performers
          if (!bestPerformer || positionReturnPercent > bestPerformer.returnPercent) {
            bestPerformer = {
              symbol: position.symbol,
              return: positionReturn,
              returnPercent: positionReturnPercent
            };
          }

          if (!worstPerformer || positionReturnPercent < worstPerformer.returnPercent) {
            worstPerformer = {
              symbol: position.symbol,
              return: positionReturn,
              returnPercent: positionReturnPercent
            };
          }
        });

        const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
        const dayChangePercent = totalCost > 0 ? (dayChange / (totalCost + totalReturn)) * 100 : 0;
        const winLossRatio = portfolio.length > 0 ? (winningPositions / portfolio.length) * 100 : 0;
        const avgReturnPerPosition = portfolio.length > 0 ? totalReturn / portfolio.length : 0;

        setMetrics({
          totalReturn,
          totalReturnPercent,
          dayChange,
          dayChangePercent,
          bestPerformer,
          worstPerformer,
          winLossRatio,
          avgReturnPerPosition
        });
      } catch (error) {
        console.error('Error calculating performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateMetrics();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No portfolio data available for analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Return</span>
            </div>
            <div className={`text-lg font-bold ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(2)}
            </div>
            <div className={`text-sm ${metrics.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.totalReturnPercent >= 0 ? '+' : ''}{metrics.totalReturnPercent.toFixed(2)}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Day Change</span>
            </div>
            <div className={`text-lg font-bold ${metrics.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.dayChange >= 0 ? '+' : ''}${metrics.dayChange.toFixed(2)}
            </div>
            <div className={`text-sm ${metrics.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.dayChangePercent >= 0 ? '+' : ''}{metrics.dayChangePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Win/Loss Ratio */}
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${metrics.winLossRatio}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{metrics.winLossRatio.toFixed(1)}%</span>
          </div>
        </div>

        {/* Best & Worst Performers */}
        <div className="space-y-4">
          <h4 className="font-medium">Top Performers</h4>
          
          {metrics.bestPerformer && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">{metrics.bestPerformer.symbol}</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Best
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-medium">
                  +${metrics.bestPerformer.return.toFixed(2)}
                </div>
                <div className="text-sm text-green-600">
                  +{metrics.bestPerformer.returnPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          )}

          {metrics.worstPerformer && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="font-medium">{metrics.worstPerformer.symbol}</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  Worst
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-red-600 font-medium">
                  ${metrics.worstPerformer.return.toFixed(2)}
                </div>
                <div className="text-sm text-red-600">
                  {metrics.worstPerformer.returnPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Average Return Per Position */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-muted-foreground">Average Return per Position</div>
          <div className={`text-lg font-bold ${metrics.avgReturnPerPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.avgReturnPerPosition >= 0 ? '+' : ''}${metrics.avgReturnPerPosition.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
