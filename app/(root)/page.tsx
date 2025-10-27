import TradingViewWidget from "@/components/TradingViewWidget";
import MarketNews from "@/components/MarketNews";
import MarketSummary from "@/components/MarketSummary";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import QuickActions from "@/components/QuickActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/better-auth/auth';
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Bell, 
  Activity,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const quickStats = [
  { label: 'Portfolio Value', value: '$125,450', change: '+2.3%', trend: 'up' },
  { label: 'Day\'s Change', value: '+$2,850', change: '+2.3%', trend: 'up' },
  { label: 'Active Alerts', value: '12', change: '3 new', trend: 'neutral' },
  { label: 'Patterns Detected', value: '5', change: '2 bullish', trend: 'up' }
];

const recentPatterns = [
  { symbol: 'AAPL', pattern: 'Bullish Engulfing', confidence: 85, type: 'bullish' },
  { symbol: 'TSLA', pattern: 'Morning Star', confidence: 92, type: 'bullish' },
  { symbol: 'MSFT', pattern: 'Doji', confidence: 68, type: 'neutral' }
];

const featuredTools = [
  {
    title: 'Advanced Charts',
    description: 'TradingView integration with pattern detection',
    icon: BarChart3,
    href: '/charts',
    badge: 'New',
    color: 'text-blue-600'
  },
  {
    title: 'Risk Management',
    description: 'Portfolio risk analysis and position sizing',
    icon: Shield,
    href: '/tools',
    badge: 'Enhanced',
    color: 'text-green-600'
  },
  {
    title: 'Pattern Alerts',
    description: 'Automated candlestick pattern notifications',
    icon: Sparkles,
    href: '/alerts',
    badge: 'Auto',
    color: 'text-purple-600'
  }
];

const Home = async () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
    
    const session = await auth.api.getSession({
        headers: await import('next/headers').then(m => m.headers())
    });

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Investment Dashboard</h1>
                    <p className="text-muted-foreground">
                        Comprehensive portfolio management with advanced analytics
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Link href="/charts">
                        <Button>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Charts
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats - Only show if user is logged in */}
            {session && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className={`flex items-center text-sm ${
                                        stat.trend === 'up' ? 'text-green-600' : 
                                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        {stat.trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                                        {stat.change}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* User Performance Dashboard */}
            {session && (
                <section className="grid w-full gap-8">
                    <div className="col-span-full">
                        <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
                        <PerformanceDashboard userId={session.user.id} />
                    </div>
                </section>
            )}

            {/* Quick Actions Section */}
            <section className="grid w-full gap-8">
                <div className="col-span-full">
                    <QuickActions />
                </div>
            </section>

            {/* Featured Tools */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Featured Tools</span>
                    </CardTitle>
                    <CardDescription>
                        Explore our advanced trading and analysis tools
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featuredTools.map((tool, index) => (
                            <Link key={index} href={tool.href}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <tool.icon className={`h-6 w-6 ${tool.color}`} />
                                            <Badge variant="secondary">{tool.badge}</Badge>
                                        </div>
                                        <h3 className="font-semibold mb-2">{tool.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                                        <div className="flex items-center text-sm text-blue-600">
                                            <span>Explore</span>
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Market Overview Section */}
            <section className="grid w-full gap-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-1">
                        <TradingViewWidget
                            title="Market Overview"
                            scriptUrl={`${scriptUrl}market-overview.js`}
                            config={MARKET_OVERVIEW_WIDGET_CONFIG}
                            className="custom-chart"
                            height={600}
                        />
                    </div>
                    <div className="xl:col-span-2">
                        <TradingViewWidget
                            title="Stock Heatmap"
                            scriptUrl={`${scriptUrl}stock-heatmap.js`}
                            config={HEATMAP_WIDGET_CONFIG}
                            height={600}
                        />
                    </div>
                </div>
            </section>

            {/* Recent Pattern Detections - Only for logged in users */}
            {session && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Activity className="h-5 w-5" />
                            <span>Recent Pattern Detections</span>
                        </CardTitle>
                        <CardDescription>
                            Latest candlestick patterns identified in your watchlist
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentPatterns.map((pattern, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="font-medium">{pattern.symbol}</div>
                                        <div className="text-sm text-muted-foreground">{pattern.pattern}</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={
                                            pattern.type === 'bullish' ? 'text-green-600 bg-green-100' :
                                            pattern.type === 'bearish' ? 'text-red-600 bg-red-100' :
                                            'text-yellow-600 bg-yellow-100'
                                        }>
                                            {pattern.confidence}% confidence
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link href="/alerts">
                                <Button variant="outline" className="w-full">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Manage Pattern Alerts
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* News and Market Data Section */}
            <section className="grid w-full gap-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-1">
                        <div className="space-y-6">
                            <MarketSummary />
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}timeline.js`}
                                config={TOP_STORIES_WIDGET_CONFIG}
                                height={400}
                            />
                            <MarketNews maxArticles={5} />
                        </div>
                    </div>
                    <div className="xl:col-span-2">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}market-quotes.js`}
                            config={MARKET_DATA_WIDGET_CONFIG}
                            height={600}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home;
