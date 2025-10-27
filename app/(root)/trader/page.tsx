import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/better-auth/auth';
import PatternDetectionPanel from '@/components/PatternDetectionPanel';
import TradingViewChartPage from '@/components/TradingViewChartPage';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Sparkles,
  PlayCircle,
  Bell,
  Settings,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

const traderMetrics = [
  {
    label: 'Active Strategies',
    value: '8',
    change: '+2 this week',
    trend: 'up',
    icon: Target
  },
  {
    label: 'Patterns Detected',
    value: '15',
    change: '5 bullish',
    trend: 'neutral',
    icon: Sparkles
  },
  {
    label: 'Win Rate',
    value: '68%',
    change: '+5% vs last month',
    trend: 'up',
    icon: TrendingUp
  },
  {
    label: 'Active Alerts',
    value: '23',
    change: '8 triggered today',
    trend: 'neutral',
    icon: Bell
  }
];

const recentSignals = [
  {
    symbol: 'AAPL',
    pattern: 'Bullish Engulfing',
    confidence: 85,
    type: 'bullish',
    price: 178.45,
    time: '2 hours ago'
  },
  {
    symbol: 'TSLA',
    pattern: 'Morning Star',
    confidence: 92,
    type: 'bullish',
    price: 245.67,
    time: '4 hours ago'
  },
  {
    symbol: 'MSFT',
    pattern: 'Bearish Harami',
    confidence: 78,
    type: 'bearish',
    price: 387.23,
    time: '5 hours ago'
  }
];

const strategies = [
  {
    name: 'Momentum Breakout',
    status: 'active',
    performance: '+12.5%',
    trades: 23,
    winRate: 65
  },
  {
    name: 'Mean Reversion',
    status: 'active',
    performance: '+8.3%',
    trades: 18,
    winRate: 72
  },
  {
    name: 'Trend Following',
    status: 'paused',
    performance: '-2.1%',
    trades: 15,
    winRate: 47
  }
];

export default async function TraderPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            Trader Platform
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced charting, pattern detection, and strategy management
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/charts">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Advanced Charts
            </Button>
          </Link>
          <Button>
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Backtesting
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {traderMetrics.map((metric, index) => (
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
      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Builder</TabsTrigger>
          <TabsTrigger value="backtest">Backtesting</TabsTrigger>
          <TabsTrigger value="charts">Advanced Charts</TabsTrigger>
        </TabsList>

        {/* Pattern Detection Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {session && <PatternDetectionPanel symbol="AAPL" />}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Signals</span>
                  </CardTitle>
                  <CardDescription>Latest pattern detections across watchlist</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSignals.map((signal, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{signal.symbol}</div>
                          <Badge className={
                            signal.type === 'bullish' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }>
                            {signal.confidence}%
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{signal.pattern}</div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${signal.price}</span>
                          <span>{signal.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Strategy Builder Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Builder</CardTitle>
                  <CardDescription>Create and manage your trading strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Build Your Strategy</h3>
                      <p className="text-muted-foreground mb-4">
                        Combine indicators, patterns, and conditions to create automated trading strategies
                      </p>
                      <Button>
                        <Target className="h-4 w-4 mr-2" />
                        Create New Strategy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Active Strategies</CardTitle>
                  <CardDescription>Your running strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {strategies.map((strategy, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{strategy.name}</div>
                          <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                            {strategy.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Performance</div>
                            <div className={`font-medium ${
                              strategy.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {strategy.performance}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Win Rate</div>
                            <div className="font-medium">{strategy.winRate}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Backtesting Tab */}
        <TabsContent value="backtest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Backtesting</CardTitle>
              <CardDescription>Test your strategies against historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Backtest Your Strategies</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Run your trading strategies against historical market data to validate performance before going live
                </p>
                <Button size="lg">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Backtesting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <TradingViewChartPage />
        </TabsContent>
      </Tabs>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Trading Resources</span>
          </CardTitle>
          <CardDescription>Learn more about technical analysis and trading strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Candlestick Patterns</h3>
              <p className="text-sm text-muted-foreground">
                Master the art of reading candlestick patterns and their implications
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Technical Indicators</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to use RSI, MACD, Moving Averages, and more
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Strategy Development</h3>
              <p className="text-sm text-muted-foreground">
                Build robust trading strategies with proper risk management
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
