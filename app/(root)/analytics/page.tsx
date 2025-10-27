import { auth } from '@/lib/better-auth/auth';
import PerformanceAnalytics from '@/components/PerformanceAnalytics';
import RiskAssessment from '@/components/RiskAssessment';
import PortfolioSummary from '@/components/PortfolioSummary';
import { getPortfolioSummary } from '@/lib/actions/portfolio.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Shield, TrendingUp } from 'lucide-react';

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Please sign in to view analytics</p>
      </div>
    );
  }

  const summary = await getPortfolioSummary(session.user.id);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your investment performance and risk metrics
        </p>
      </div>

      <PortfolioSummary summary={summary} />

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Analytics
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-6">
          <PerformanceAnalytics userId={session.user.id} />
        </TabsContent>
        
        <TabsContent value="risk" className="mt-6">
          <RiskAssessment userId={session.user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
