import EconomicCalendar from '@/components/EconomicCalendar';
import MarketSummary from '@/components/MarketSummary';
import MarketSentiment from '@/components/MarketSentiment';
import StockScreener from '@/components/StockScreener';
import RiskManagementDashboard from '@/components/RiskManagementDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Calendar, Target, Shield } from 'lucide-react';

export default function TradingToolsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trading Tools</h1>
        <p className="text-muted-foreground">
          Essential tools and information for informed trading decisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Tools */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="screener" className="w-full">            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="screener" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Stock Screener
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Position Calculator
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Risk Management
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="screener" className="mt-6">
              <StockScreener />
            </TabsContent>
            
            <TabsContent value="calculator" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Position Size Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Account Size ($)</label>
                        <input 
                          type="number" 
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Risk Percentage (%)</label>
                        <input 
                          type="number" 
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Entry Price ($)</label>
                        <input 
                          type="number" 
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="150"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stop Loss ($)</label>
                        <input 
                          type="number" 
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="145"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Recommended Position Size</div>
                      <div className="text-2xl font-bold">40 shares</div>
                      <div className="text-sm text-muted-foreground">Risk Amount: $200</div>
                    </div>
                  </div>
                </CardContent>
              </Card>            </TabsContent>
            
            <TabsContent value="risk" className="mt-6">
              <RiskManagementDashboard />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Fear & Greed Index</span>
                        <span className="font-bold text-green-600">72 - Greed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on volatility, momentum, and other market indicators
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sector Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { sector: 'Technology', change: '+2.1%', color: 'text-green-600' },
                        { sector: 'Healthcare', change: '+1.8%', color: 'text-green-600' },
                        { sector: 'Financials', change: '+0.5%', color: 'text-green-600' },
                        { sector: 'Energy', change: '-0.3%', color: 'text-red-600' },
                        { sector: 'Utilities', change: '-1.2%', color: 'text-red-600' },
                      ].map((item) => (
                        <div key={item.sector} className="flex items-center justify-between">
                          <span className="text-sm">{item.sector}</span>
                          <span className={`text-sm font-medium ${item.color}`}>
                            {item.change}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <MarketSummary />
          <EconomicCalendar />
        </div>
      </div>
    </div>
  );
}
