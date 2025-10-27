import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/better-auth/auth';
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Briefcase,
  PieChart,
  LineChart,
  Activity,
  ArrowRight,
  Sparkles,
  Target,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Module cards for role-based navigation
const modules = [
  {
    title: 'Trader Platform',
    description: 'Advanced charting, pattern detection, strategy backtesting, and automated alerts',
    icon: BarChart3,
    href: '/trader',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Pattern Detection', 'Strategy Builder', 'Backtesting', 'Real-time Alerts']
  },
  {
    title: 'Investor Hub',
    description: 'Financial reports, fundamental analysis, market news, and long-term insights',
    icon: Briefcase,
    href: '/investor',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Financial Reports', 'Fundamental Analysis', 'Market News', 'Company Insights']
  },
  {
    title: 'Risk Management',
    description: 'Risk scoring, position sizing, stop-loss management, and portfolio analysis',
    icon: Shield,
    href: '/risk-management',
    gradient: 'from-orange-500 to-red-500',
    features: ['Risk Scoring', 'Position Sizing', 'VaR Analysis', 'Stress Testing']
  },
  {
    title: 'Portfolio Manager',
    description: 'Track holdings, analyze performance, visualize allocation, and optimize returns',
    icon: PieChart,
    href: '/portfolio',
    gradient: 'from-green-500 to-teal-500',
    features: ['Holdings Tracking', 'Performance Analytics', 'Allocation View', 'Rebalancing']
  }
];

const marketStats = [
  { label: 'S&P 500', value: '4,567.89', change: '+1.2%', trend: 'up' },
  { label: 'NASDAQ', value: '14,234.56', change: '+2.1%', trend: 'up' },
  { label: 'Dow Jones', value: '35,678.12', change: '-0.3%', trend: 'down' },
  { label: 'VIX', value: '18.45', change: '-2.5%', trend: 'down' }
];

const Home = async () => {
    const session = await auth.api.getSession({
        headers: await import('next/headers').then(m => m.headers())
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="mb-12">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Professional Trading & Investment Platform
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Unified platform for traders and investors with advanced analytics, risk management, and portfolio optimization
                    </p>
                </div>

                {/* Market Overview Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {marketStats.map((stat, index) => (
                        <Card key={index} className="border-l-4" style={{ borderLeftColor: stat.trend === 'up' ? '#10b981' : '#ef4444' }}>
                            <CardContent className="p-4">
                                <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className={`text-sm font-medium ${
                                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.change}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Platform Modules */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Choose Your Platform</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map((module, index) => (
                        <Link key={index} href={module.href}>
                            <Card className="group h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${module.gradient}`}>
                                            <module.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                                    <p className="text-muted-foreground mb-4">{module.description}</p>
                                    
                                    <div className="space-y-2">
                                        {module.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Access Section for Logged-in Users */}
            {session && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/portfolio">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-green-100">
                                            <PieChart className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">My Portfolio</div>
                                            <div className="text-sm text-muted-foreground">View holdings</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        
                        <Link href="/watchlist">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-blue-100">
                                            <Activity className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Watchlist</div>
                                            <div className="text-sm text-muted-foreground">Track stocks</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        
                        <Link href="/alerts">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-orange-100">
                                            <AlertCircle className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Alerts</div>
                                            <div className="text-sm text-muted-foreground">Manage alerts</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            )}

            {/* Features Overview */}
            <div className="mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Platform Features</CardTitle>
                        <CardDescription>
                            Everything you need for professional trading and investing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-semibold">AI-Powered Insights</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Advanced pattern detection and market prediction models for informed decision-making
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <LineChart className="h-5 w-5 text-purple-600" />
                                    <h3 className="font-semibold">Real-Time Data</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Live market data, instant alerts, and real-time portfolio tracking
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Target className="h-5 w-5 text-green-600" />
                                    <h3 className="font-semibold">Risk Management</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Comprehensive risk analysis, position sizing, and portfolio optimization tools
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Home;
