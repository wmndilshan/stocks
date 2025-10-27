'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Target, DollarSign } from 'lucide-react';
import { getStockQuote, getCompanyProfile } from '@/lib/actions/finnhub.actions';

interface StockAnalysisProps {
  symbol: string;
}

interface StockAnalysis {
  quote: StockQuote | null;
  profile: CompanyProfile | null;
  recommendation: 'BUY' | 'HOLD' | 'SELL' | 'NEUTRAL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  targetPrice: number | null;
}

export default function StockAnalysis({ symbol }: StockAnalysisProps) {
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const [quote, profile] = await Promise.all([
          getStockQuote(symbol),
          getCompanyProfile(symbol)
        ]);

        // Simple analysis logic
        let recommendation: StockAnalysis['recommendation'] = 'NEUTRAL';
        let riskLevel: StockAnalysis['riskLevel'] = 'MEDIUM';
        let targetPrice: number | null = null;

        if (quote) {
          const changePercent = quote.dp;
          const volatility = Math.abs(changePercent);

          // Simple recommendation based on momentum and volatility
          if (changePercent > 5) {
            recommendation = 'BUY';
          } else if (changePercent < -5) {
            recommendation = 'SELL';
          } else if (changePercent > 0) {
            recommendation = 'HOLD';
          }

          // Risk assessment based on volatility
          if (volatility > 10) {
            riskLevel = 'HIGH';
          } else if (volatility < 2) {
            riskLevel = 'LOW';
          }

          // Simple target price calculation (current price + 10%)
          targetPrice = quote.c * 1.1;
        }

        setAnalysis({
          quote,
          profile,
          recommendation,
          riskLevel,
          targetPrice
        });
      } catch (error) {
        console.error('Error fetching stock analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis || !analysis.quote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load analysis data</p>
        </CardContent>
      </Card>
    );
  }

  const { quote, profile, recommendation, riskLevel, targetPrice } = analysis;
  const isPositive = quote.d >= 0;

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-green-600';
      case 'SELL': return 'bg-red-600';
      case 'HOLD': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'HIGH': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Stock Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Price & Change */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                ${quote.c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? '+' : ''}${quote.d.toFixed(2)} ({isPositive ? '+' : ''}{quote.dp.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Analysis Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Recommendation</span>
              <Badge className={`${getRecommendationColor(recommendation)} text-white`}>
                {recommendation}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <Badge className={`${getRiskColor(riskLevel)} text-white`}>
                {riskLevel}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Target Price</span>
            </div>
            <div className="text-lg font-semibold">
              {targetPrice ? `$${targetPrice.toFixed(2)}` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Day's Range */}
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Day's Range</span>
          <div className="flex items-center gap-4">
            <span className="text-sm">Low: ${quote.l.toFixed(2)}</span>
            <span className="text-sm">High: ${quote.h.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${((quote.c - quote.l) / (quote.h - quote.l)) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Company Info */}
        {profile && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Company Info</span>
            <div className="text-sm space-y-1">
              <div>Exchange: {profile.exchange}</div>
              <div>Country: {profile.country}</div>
              <div>Industry: {profile.finnhubIndustry}</div>
              {profile.marketCapitalization && (
                <div>Market Cap: ${(profile.marketCapitalization / 1000).toFixed(2)}B</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
