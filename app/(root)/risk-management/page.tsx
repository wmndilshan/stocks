import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/better-auth/auth';
import RiskManagementDashboard from '@/components/RiskManagementDashboard';
import { Shield, AlertTriangle, TrendingDown, Activity } from 'lucide-react';

export default async function RiskManagementPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Shield className="h-8 w-8 text-white" />
            </div>
            Risk Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive risk analysis, position sizing, and portfolio protection
          </p>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <Shield className="h-5 w-5" />
              <span>Low Risk Holdings</span>
            </CardTitle>
            <CardDescription>Stable positions with minimal volatility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">65%</div>
            <p className="text-sm text-muted-foreground mt-1">
              8 of 12 positions rated low risk
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-600">
              <Activity className="h-5 w-5" />
              <span>Medium Risk Holdings</span>
            </CardTitle>
            <CardDescription>Moderate volatility and risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">25%</div>
            <p className="text-sm text-muted-foreground mt-1">
              3 of 12 positions rated medium risk
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>High Risk Holdings</span>
            </CardTitle>
            <CardDescription>Positions requiring close monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10%</div>
            <p className="text-sm text-muted-foreground mt-1">
              1 of 12 positions rated high risk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Risk Dashboard */}
      <RiskManagementDashboard />

      {/* Risk Education */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Management Best Practices</CardTitle>
          <CardDescription>Essential principles for protecting your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Position Sizing</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Never risk more than 1-2% of capital on a single trade</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Calculate position size based on stop-loss distance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Adjust size based on volatility and risk score</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Diversification</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Spread investments across different sectors and asset classes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Avoid over-concentration in any single position</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Balance growth and value investments</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Stop-Loss Management</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Always define exit points before entering a position</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use technical levels for stop-loss placement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Trail stops to protect profits as position moves in your favor</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Risk Monitoring</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Regularly review portfolio risk metrics and VaR</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Conduct stress tests under various market scenarios</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Rebalance when risk exceeds acceptable thresholds</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
