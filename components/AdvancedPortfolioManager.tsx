'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  weight: number;
  sector: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  beta: number;
  volatility: number;
}

interface PortfolioRisk {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  diversificationScore: number;
  riskScore: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  var95: number; // Value at Risk 95%
}

interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  riskLevel: string;
}

export default function AdvancedPortfolioManager() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [portfolioRisk, setPortfolioRisk] = useState<PortfolioRisk | null>(null);
  const [sectorAllocation, setSectorAllocation] = useState<SectorAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      // Simulate portfolio data - replace with actual API calls
      const mockHoldings: PortfolioHolding[] = [
        {
          symbol: 'AAPL',
          quantity: 100,
          avgPrice: 150.00,
          currentPrice: 175.50,
          value: 17550,
          gainLoss: 2550,
          gainLossPercent: 17.0,
          weight: 35.1,
          sector: 'Technology',
          riskLevel: 'Medium',
          beta: 1.2,
          volatility: 0.25
        },
        {
          symbol: 'MSFT',
          quantity: 50,
          avgPrice: 300.00,
          currentPrice: 340.75,
          value: 17037.50,
          gainLoss: 2037.50,
          gainLossPercent: 13.6,
          weight: 34.1,
          sector: 'Technology',
          riskLevel: 'Medium',
          beta: 0.9,
          volatility: 0.22
        },
        {
          symbol: 'JPM',
          quantity: 75,
          avgPrice: 140.00,
          currentPrice: 155.25,
          value: 11643.75,
          gainLoss: 1143.75,
          gainLossPercent: 10.9,
          weight: 23.3,
          sector: 'Financial',
          riskLevel: 'Medium',
          beta: 1.1,
          volatility: 0.28
        },
        {
          symbol: 'JNJ',
          quantity: 40,
          avgPrice: 160.00,
          currentPrice: 168.50,
          value: 3740,
          gainLoss: 340,
          gainLossPercent: 5.3,
          weight: 7.5,
          sector: 'Healthcare',
          riskLevel: 'Low',
          beta: 0.7,
          volatility: 0.15
        }
      ];

      const mockRisk: PortfolioRisk = {
        totalValue: 49971.25,
        totalGainLoss: 6071.25,
        totalGainLossPercent: 13.8,
        diversificationScore: 72,
        riskScore: 65,
        sharpeRatio: 1.35,
        maxDrawdown: -12.5,
        volatility: 0.24,
        beta: 1.05,
        var95: -4200
      };

      const mockSectors: SectorAllocation[] = [
        { sector: 'Technology', value: 34587.50, percentage: 69.2, riskLevel: 'Medium' },
        { sector: 'Financial', value: 11643.75, percentage: 23.3, riskLevel: 'Medium' },
        { sector: 'Healthcare', value: 3740, percentage: 7.5, riskLevel: 'Low' }
      ];

      setHoldings(mockHoldings);
      setPortfolioRisk(mockRisk);
      setSectorAllocation(mockSectors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setLoading(false);
    }
  };
  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioRisk?.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +${portfolioRisk?.totalGainLoss.toLocaleString()} ({portfolioRisk?.totalGainLossPercent}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioRisk?.riskScore}/100</div>
            <Progress value={portfolioRisk?.riskScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioRisk?.sharpeRatio}</div>
            <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Beta</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioRisk?.beta}</div>
            <p className="text-xs text-muted-foreground">Market correlation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Your current stock positions and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-right p-2">Quantity</th>
                      <th className="text-right p-2">Avg Price</th>
                      <th className="text-right p-2">Current Price</th>
                      <th className="text-right p-2">Value</th>
                      <th className="text-right p-2">Gain/Loss</th>
                      <th className="text-right p-2">Weight</th>
                      <th className="text-center p-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => (
                      <tr key={holding.symbol} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{holding.symbol}</td>
                        <td className="text-right p-2">{holding.quantity}</td>
                        <td className="text-right p-2">${holding.avgPrice.toFixed(2)}</td>
                        <td className="text-right p-2">${holding.currentPrice.toFixed(2)}</td>
                        <td className="text-right p-2">${holding.value.toLocaleString()}</td>
                        <td className={`text-right p-2 ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(2)}
                          <br />
                          <span className="text-xs">
                            ({holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent}%)
                          </span>
                        </td>
                        <td className="text-right p-2">{holding.weight.toFixed(1)}%</td>
                        <td className="text-center p-2">
                          <Badge className={getRiskTextColor(holding.riskLevel)}>
                            {holding.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
                <CardDescription>Portfolio diversification by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorAllocation.map((sector) => (
                    <div key={sector.sector} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{sector.sector}</span>
                        <div className="text-right">
                          <div className="font-medium">{sector.percentage.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">${sector.value.toLocaleString()}</div>
                        </div>
                      </div>
                      <Progress value={sector.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diversification Score</CardTitle>
                <CardDescription>Portfolio diversification analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {portfolioRisk?.diversificationScore}/100
                  </div>
                  <Progress value={portfolioRisk?.diversificationScore} className="h-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Sectors</div>
                      <div className="text-gray-600">{sectorAllocation.length}</div>
                    </div>
                    <div>
                      <div className="font-medium">Holdings</div>
                      <div className="text-gray-600">{holdings.length}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Portfolio risk assessment indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Portfolio Volatility</span>
                    <span className="font-medium">{(portfolioRisk?.volatility * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Max Drawdown</span>
                    <span className="font-medium text-red-600">{portfolioRisk?.maxDrawdown}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Value at Risk (95%)</span>
                    <span className="font-medium text-red-600">${portfolioRisk?.var95.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Portfolio Beta</span>
                    <span className="font-medium">{portfolioRisk?.beta}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Recommendations</CardTitle>
                <CardDescription>Suggestions to improve portfolio balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">High Technology Concentration</div>
                      <div className="text-gray-600">Consider diversifying into other sectors</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Add Defensive Stocks</div>
                      <div className="text-gray-600">Consider utilities or consumer staples</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Good Risk-Adjusted Returns</div>
                      <div className="text-gray-600">Sharpe ratio above 1.0 is excellent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Historical performance and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Performance Charts Coming Soon</h3>
                <p className="text-gray-600">Advanced performance analytics and historical charts will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
