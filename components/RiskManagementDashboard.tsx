'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown,
  Calculator,
  Target,
  Activity,
  DollarSign,
  Percent
} from 'lucide-react';

interface RiskMetrics {
  portfolioValue: number;
  dailyVaR: number;
  weeklyVaR: number;
  monthlyVaR: number;
  maxDrawdown: number;
  sharpeRatio: number;
  beta: number;
  volatility: number;
  riskScore: number;
}

interface PositionRisk {
  symbol: string;
  value: number;
  weight: number;
  beta: number;
  volatility: number;
  var95: number;
  riskContribution: number;
}

export default function RiskManagementDashboard() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [positionRisks, setPositionRisks] = useState<PositionRisk[]>([]);
  const [positionSize, setPositionSize] = useState(10000);
  const [stopLossPercent, setStopLossPercent] = useState(5);
  const [riskPerTrade, setRiskPerTrade] = useState(2);

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    // Simulate risk data - replace with actual API calls
    const mockRiskMetrics: RiskMetrics = {
      portfolioValue: 125000,
      dailyVaR: -2500,
      weeklyVaR: -5500,
      monthlyVaR: -12000,
      maxDrawdown: -15.5,
      sharpeRatio: 1.35,
      beta: 1.05,
      volatility: 0.18,
      riskScore: 68
    };

    const mockPositionRisks: PositionRisk[] = [
      {
        symbol: 'AAPL',
        value: 43750,
        weight: 35.0,
        beta: 1.2,
        volatility: 0.25,
        var95: -875,
        riskContribution: 28.5
      },
      {
        symbol: 'MSFT',
        value: 37500,
        weight: 30.0,
        beta: 0.9,
        volatility: 0.22,
        var95: -750,
        riskContribution: 24.8
      },
      {
        symbol: 'GOOGL',
        value: 25000,
        weight: 20.0,
        beta: 1.1,
        volatility: 0.28,
        var95: -700,
        riskContribution: 22.1
      },
      {
        symbol: 'TSLA',
        value: 18750,
        weight: 15.0,
        beta: 1.8,
        volatility: 0.45,
        var95: -938,
        riskContribution: 24.6
      }
    ];

    setRiskMetrics(mockRiskMetrics);
    setPositionRisks(mockPositionRisks);
  };

  const calculatePositionSize = () => {
    const accountValue = riskMetrics?.portfolioValue || 100000;
    const riskAmount = (accountValue * riskPerTrade) / 100;
    const stopLossAmount = (positionSize * stopLossPercent) / 100;
    const maxShares = Math.floor(riskAmount / stopLossAmount);
    const recommendedPosition = maxShares * (positionSize / 100); // Assuming $100 per share for calculation
    
    return {
      riskAmount,
      stopLossAmount,
      maxShares,
      recommendedPosition
    };
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const positionCalc = calculatePositionSize();

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics?.riskScore}/100</div>
            <Progress value={riskMetrics?.riskScore} className="mt-2" />
            <Badge className={getRiskColor(riskMetrics?.riskScore || 0)}>
              {riskMetrics?.riskScore && riskMetrics.riskScore < 30 ? 'Low Risk' : 
               riskMetrics?.riskScore && riskMetrics.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily VaR (95%)</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${Math.abs(riskMetrics?.dailyVaR || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum daily loss (95% confidence)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {riskMetrics?.maxDrawdown}%
            </div>
            <p className="text-xs text-muted-foreground">
              Historical peak-to-trough decline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {riskMetrics?.sharpeRatio}
            </div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted return measure
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="positions">Position Risk</TabsTrigger>
          <TabsTrigger value="calculator">Position Calculator</TabsTrigger>
          <TabsTrigger value="scenarios">Stress Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Value at Risk (VaR)</CardTitle>
                <CardDescription>Potential losses at different time horizons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Daily VaR (95%)</span>
                    <span className="font-medium text-red-600">
                      ${Math.abs(riskMetrics?.dailyVaR || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekly VaR (95%)</span>
                    <span className="font-medium text-red-600">
                      ${Math.abs(riskMetrics?.weeklyVaR || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly VaR (95%)</span>
                    <span className="font-medium text-red-600">
                      ${Math.abs(riskMetrics?.monthlyVaR || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Metrics</CardTitle>
                <CardDescription>Key risk and return characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Portfolio Beta</span>
                    <span className="font-medium">{riskMetrics?.beta}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Volatility (Annual)</span>
                    <span className="font-medium">{((riskMetrics?.volatility || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sharpe Ratio</span>
                    <span className="font-medium text-green-600">{riskMetrics?.sharpeRatio}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Position Risk Analysis</CardTitle>
              <CardDescription>Risk contribution by individual positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-right p-2">Value</th>
                      <th className="text-right p-2">Weight</th>
                      <th className="text-right p-2">Beta</th>
                      <th className="text-right p-2">Volatility</th>
                      <th className="text-right p-2">VaR (95%)</th>
                      <th className="text-right p-2">Risk Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positionRisks.map((position) => (
                      <tr key={position.symbol} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{position.symbol}</td>
                        <td className="text-right p-2">${position.value.toLocaleString()}</td>
                        <td className="text-right p-2">{position.weight.toFixed(1)}%</td>
                        <td className="text-right p-2">{position.beta}</td>
                        <td className="text-right p-2">{(position.volatility * 100).toFixed(1)}%</td>
                        <td className="text-right p-2 text-red-600">
                          ${Math.abs(position.var95).toLocaleString()}
                        </td>
                        <td className="text-right p-2">{position.riskContribution.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Position Size Calculator</span>
              </CardTitle>
              <CardDescription>
                Calculate optimal position size based on risk management rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="position-size">Position Size ($)</Label>
                    <Input
                      id="position-size"
                      type="number"
                      value={positionSize}
                      onChange={(e) => setPositionSize(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                    <Input
                      id="stop-loss"
                      type="number"
                      value={stopLossPercent}
                      onChange={(e) => setStopLossPercent(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="risk-per-trade">Risk Per Trade (%)</Label>
                    <Input
                      id="risk-per-trade"
                      type="number"
                      value={riskPerTrade}
                      onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-3">Calculation Results</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Risk Amount:</span>
                        <span className="font-medium">${positionCalc.riskAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stop Loss Amount:</span>
                        <span className="font-medium">${positionCalc.stopLossAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Shares:</span>
                        <span className="font-medium">{positionCalc.maxShares}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Recommended Position:</span>
                        <span className="font-bold text-blue-600">
                          ${positionCalc.recommendedPosition.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stress Testing</CardTitle>
              <CardDescription>
                Portfolio performance under different market scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-600 mb-2">Bear Market (-30%)</h4>
                  <div className="text-sm space-y-1">
                    <div>Portfolio Loss: <span className="font-medium">-$37,500</span></div>
                    <div>Recovery Time: <span className="font-medium">18-24 months</span></div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-yellow-600 mb-2">Correction (-15%)</h4>
                  <div className="text-sm space-y-1">
                    <div>Portfolio Loss: <span className="font-medium">-$18,750</span></div>
                    <div>Recovery Time: <span className="font-medium">6-12 months</span></div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-600 mb-2">Bull Market (+25%)</h4>
                  <div className="text-sm space-y-1">
                    <div>Portfolio Gain: <span className="font-medium">+$31,250</span></div>
                    <div>Risk Adjustment: <span className="font-medium">Rebalance</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
