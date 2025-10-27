import AdvancedPortfolioManager from '@/components/AdvancedPortfolioManager';

export default function PortfolioPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Management</h1>
          <p className="text-muted-foreground">
            Advanced portfolio tracking with risk management and analytics
          </p>
        </div>
      </div>
      
      <AdvancedPortfolioManager />
    </div>
  );
}
