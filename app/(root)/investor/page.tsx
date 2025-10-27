import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/better-auth/auth';
import MarketNews from '@/components/MarketNews';
import StockAnalysis from '@/components/StockAnalysis';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  FileText,
  Newspaper,
  BarChart3,
  Target,
  Building,
  Users,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

const investorMetrics = [
  {
    label: 'Portfolio Value',
    value: '$245,680',
    change: '+8.5%',
    trend: 'up',
    icon: DollarSign,
    period: 'YTD'
  },
  {
    label: 'Holdings',
    value: '12',
    change: '3 undervalued',
    trend: 'neutral',
    icon: Building,
    period: 'Active'
  },
  {
    label: 'Dividend Yield',
    value: '3.2%',
    change: '+0.4% vs last year',
    trend: 'up',
    icon: TrendingUp,
    period: 'Annual'
  },
  {
    label: 'Reports Tracked',
    value: '8',
    change: '3 earnings this week',
    trend: 'neutral',
    icon: FileText,
    period: 'Upcoming'
  }
];

const fundamentalData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    pe: 28.5,
    pb: 45.2,
    roe: 147.3,
    debtToEquity: 1.72,
    dividend: 0.56,
    rating: 'Buy',
    targetPrice: 195
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    pe: 35.8,
    pb: 12.4,
    roe: 42.1,
    debtToEquity: 0.35,
    dividend: 0.68,
    rating: 'Buy',
    targetPrice: 425
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    pe: 25.3,
    pb: 6.2,
    roe: 29.4,
    debtToEquity: 0.11,
    dividend: 0,
    rating: 'Hold',
    targetPrice: 155
  }
];

const upcomingEarnings = [
  {
    symbol: 'AAPL',
    company: 'Apple Inc.',
    date: 'Jan 30, 2026',
    time: 'After Market',
    estimate: '$2.18 EPS'
  },
  {
    symbol: 'MSFT',
    company: 'Microsoft Corp.',
    date: 'Jan 28, 2026',
    time: 'After Market',
    estimate: '$2.75 EPS'
  },
  {
    symbol: 'AMZN',
    company: 'Amazon.com Inc.',
    date: 'Feb 2, 2026',
    time: 'After Market',
    estimate: '$1.05 EPS'
  }
];

const marketInsights = [
  {
    title: 'Tech Sector Analysis',
    date: 'Today',
    category: 'Sector',
    summary: 'Technology sector shows strong momentum with major players reporting solid earnings growth'
  },
  {
    title: 'Federal Reserve Meeting',
    date: 'Yesterday',
    category: 'Economy',
    summary: 'Fed signals potential rate cuts in Q2 2026, positive for equity markets'
  },
  {
    title: 'Dividend Aristocrats Update',
    date: '2 days ago',
    category: 'Strategy',
    summary: 'Analysis of dividend-paying stocks with 25+ years of consecutive increases'
  }
];

export default async function InvestorPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            Investor Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Financial reports, fundamental analysis, and long-term investment insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/stock-screener">
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Stock Screener
            </Button>
          </Link>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {investorMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <metric.icon className="h-5 w-5 text-muted-foreground" />
                {metric.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className="text-2xl font-bold mt-1">{metric.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="fundamentals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fundamentals">Fundamental Analysis</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="news">Market News</TabsTrigger>
          <TabsTrigger value="insights">Investment Insights</TabsTrigger>
        </TabsList>

        {/* Fundamental Analysis Tab */}
        <TabsContent value="fundamentals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Fundamental Metrics</CardTitle>
                  <CardDescription>Key financial ratios and valuations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Company</th>
                          <th className="text-right p-2 font-semibold">P/E</th>
                          <th className="text-right p-2 font-semibold">P/B</th>
                          <th className="text-right p-2 font-semibold">ROE%</th>
                          <th className="text-right p-2 font-semibold">D/E</th>
                          <th className="text-right p-2 font-semibold">Yield%</th>
                          <th className="text-center p-2 font-semibold">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fundamentalData.map((stock, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground">{stock.name}</div>
                              </div>
                            </td>
                            <td className="text-right p-2">{stock.pe}</td>
                            <td className="text-right p-2">{stock.pb}</td>
                            <td className="text-right p-2 text-green-600">{stock.roe}%</td>
                            <td className="text-right p-2">{stock.debtToEquity}</td>
                            <td className="text-right p-2">{stock.dividend}%</td>
                            <td className="text-center p-2">
                              <Badge className={
                                stock.rating === 'Buy' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-yellow-100 text-yellow-600'
                              }>
                                {stock.rating}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                {session && <StockAnalysis symbol="AAPL" />}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Earnings</span>
                  </CardTitle>
                  <CardDescription>Earnings reports this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEarnings.map((earning, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{earning.symbol}</div>
                          <Badge variant="outline">{earning.time}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{earning.company}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{earning.date}</span>
                          <span className="font-medium">{earning.estimate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Financial Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports & Filings</CardTitle>
              <CardDescription>Latest SEC filings and financial statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Financial Reports</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Access comprehensive financial statements, 10-K, 10-Q, and earnings transcripts
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      View 10-K Reports
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Earnings Transcripts
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold">Income Statement</h4>
                    <p className="text-sm text-muted-foreground">
                      Revenue, expenses, and profitability analysis
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold">Balance Sheet</h4>
                    <p className="text-sm text-muted-foreground">
                      Assets, liabilities, and shareholder equity
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold">Cash Flow</h4>
                    <p className="text-sm text-muted-foreground">
                      Operating, investing, and financing activities
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market News Tab */}
        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Newspaper className="h-5 w-5" />
                  <span>Latest Market News</span>
                </CardTitle>
                <CardDescription>Real-time financial news and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <MarketNews maxArticles={10} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Curated analysis and commentary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.summary}</p>
                      <div className="text-xs text-muted-foreground">{insight.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Investment Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Strategies & Insights</CardTitle>
              <CardDescription>Long-term investment guidance and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Value Investing</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">Undervalued Opportunities</h4>
                      <p className="text-sm text-muted-foreground">
                        Stocks trading below intrinsic value with strong fundamentals
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">Dividend Aristocrats</h4>
                      <p className="text-sm text-muted-foreground">
                        Companies with 25+ years of consistent dividend growth
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Growth Investing</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium">High Growth Potential</h4>
                      <p className="text-sm text-muted-foreground">
                        Companies with strong revenue growth and market expansion
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium">Innovation Leaders</h4>
                      <p className="text-sm text-muted-foreground">
                        Tech and disruptive companies leading their industries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
              <CardDescription>Recommended portfolio distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { sector: 'Technology', allocation: 30, performance: '+12.5%' },
                  { sector: 'Healthcare', allocation: 20, performance: '+8.2%' },
                  { sector: 'Financials', allocation: 15, performance: '+6.1%' },
                  { sector: 'Consumer Discretionary', allocation: 15, performance: '+9.3%' },
                  { sector: 'Industrials', allocation: 10, performance: '+4.7%' },
                  { sector: 'Other', allocation: 10, performance: '+5.2%' }
                ].map((sector, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{sector.sector}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">{sector.allocation}%</span>
                        <span className="text-green-600">{sector.performance}</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                        style={{ width: `${sector.allocation}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
