'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, TrendingUp, PieChart } from 'lucide-react';
import { getPortfolio } from '@/lib/actions/portfolio.actions';

interface RiskMetrics {
  overallRiskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  diversificationScore: number;
  concentrationRisk: boolean;
  largestPosition: {
    symbol: string;
    percentage: number;
  } | null;
  sectorConcentration: {
    [sector: string]: number;
  };
  recommendations: string[];
}

interface RiskAssessmentProps {
  userId: string;
}

export default function RiskAssessment({ userId }: RiskAssessmentProps) {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assessRisk = async () => {
      try {
        const portfolio = await getPortfolio(userId);
        
        if (portfolio.length === 0) {
          setRiskMetrics(null);
          setLoading(false);
          return;
        }

        let totalValue = 0;
        const positionValues: { [symbol: string]: number } = {};
        
        // Calculate total portfolio value and individual position values
        portfolio.forEach(position => {
          const value = position.quantity * position.currentPrice;
          totalValue += value;
          positionValues[position.symbol] = value;
        });

        // Find largest position
        let largestPosition: RiskMetrics['largestPosition'] = null;
        let maxPercentage = 0;
        
        Object.entries(positionValues).forEach(([symbol, value]) => {
          const percentage = (value / totalValue) * 100;
          if (percentage > maxPercentage) {
            maxPercentage = percentage;
            largestPosition = { symbol, percentage };
          }
        });

        // Calculate concentration risk
        const concentrationRisk = maxPercentage > 20; // More than 20% in single position

        // Simple diversification score based on number of positions
        const diversificationScore = Math.min(100, (portfolio.length / 20) * 100);

        // Mock sector concentration (in real app, would use company profile data)
        const sectorConcentration = {
          'Technology': 35,
          'Healthcare': 20,
          'Finance': 25,
          'Energy': 10,
          'Consumer': 10
        };

        // Calculate overall risk score
        let riskScore = 0;
        
        // Add risk for concentration
        if (concentrationRisk) riskScore += 30;
        
        // Add risk for low diversification
        if (diversificationScore < 50) riskScore += 25;
        
        // Add risk for sector concentration
        const maxSectorConcentration = Math.max(...Object.values(sectorConcentration));
        if (maxSectorConcentration > 40) riskScore += 20;
        
        // Add risk for portfolio size
        if (portfolio.length < 5) riskScore += 15;

        // Determine risk level
        let riskLevel: RiskMetrics['riskLevel'] = 'LOW';
        if (riskScore > 70) riskLevel = 'VERY_HIGH';
        else if (riskScore > 50) riskLevel = 'HIGH';
        else if (riskScore > 30) riskLevel = 'MEDIUM';

        // Generate recommendations
        const recommendations: string[] = [];
        if (concentrationRisk) {
          recommendations.push(`Consider reducing position in ${largestPosition?.symbol} (${largestPosition?.percentage.toFixed(1)}% of portfolio)`);
        }
        if (diversificationScore < 50) {
          recommendations.push('Add more positions to improve diversification');
        }
        if (maxSectorConcentration > 40) {
          recommendations.push('Consider diversifying across more sectors');
        }
        if (portfolio.length < 10) {
          recommendations.push('Consider increasing number of positions for better risk distribution');
        }
        if (recommendations.length === 0) {
          recommendations.push('Portfolio shows good diversification and risk management');
        }

        setRiskMetrics({
          overallRiskScore: riskScore,
          riskLevel,
          diversificationScore,
          concentrationRisk,
          largestPosition,
          sectorConcentration,
          recommendations
        });
      } catch (error) {
        console.error('Error assessing portfolio risk:', error);
      } finally {
        setLoading(false);
      }
    };

    assessRisk();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
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

  if (!riskMetrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No portfolio data available for risk assessment</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'MEDIUM': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'HIGH': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'VERY_HIGH': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const riskColors = getRiskColor(riskMetrics.riskLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Risk Level</span>
            <Badge className={`${riskColors.bg} ${riskColors.text} ${riskColors.border}`}>
              {riskMetrics.riskLevel.replace('_', ' ')}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                riskMetrics.riskLevel === 'LOW' ? 'bg-green-500' :
                riskMetrics.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                riskMetrics.riskLevel === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${riskMetrics.overallRiskScore}%` }}
            ></div>
          </div>
          <div className="text-sm text-muted-foreground">
            Risk Score: {riskMetrics.overallRiskScore}/100
          </div>
        </div>

        {/* Diversification Score */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Diversification</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${riskMetrics.diversificationScore}%` }}
            ></div>
          </div>
          <div className="text-sm text-muted-foreground">
            Score: {riskMetrics.diversificationScore.toFixed(0)}/100
          </div>
        </div>

        {/* Concentration Risk */}
        {riskMetrics.concentrationRisk && riskMetrics.largestPosition && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Concentration Risk Detected</span>
            </div>
            <div className="text-sm text-orange-700">
              {riskMetrics.largestPosition.symbol} represents {riskMetrics.largestPosition.percentage.toFixed(1)}% of your portfolio
            </div>
          </div>
        )}

        {/* Sector Allocation */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Sector Allocation</span>
          <div className="space-y-2">
            {Object.entries(riskMetrics.sectorConcentration).map(([sector, percentage]) => (
              <div key={sector} className="flex items-center justify-between">
                <span className="text-sm">{sector}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recommendations</span>
          </div>
          <div className="space-y-2">
            {riskMetrics.recommendations.map((recommendation, index) => (
              <div key={index} className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                • {recommendation}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
