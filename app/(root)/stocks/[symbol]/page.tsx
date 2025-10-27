import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import StockAnalysis from "@/components/StockAnalysis";
import MarketNews from "@/components/MarketNews";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import AddAlertDialog from "@/components/AddAlertDialog";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Left column - Charts */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{symbol.toUpperCase()}</h1>
            <div className="flex items-center gap-2">
              <AddTransactionDialog>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </AddTransactionDialog>
              <AddAlertDialog>
                <Button size="sm" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </AddAlertDialog>
              <WatchlistButton symbol={symbol.toUpperCase()} company={symbol.toUpperCase()} isInWatchlist={false} />
            </div>
          </div>

          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column - Analysis & Info */}
        <div className="flex flex-col gap-6">
          <StockAnalysis symbol={symbol} />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <MarketNews symbols={[symbol]} maxArticles={3} />
        </div>      </section>
    </div>
  );
}
