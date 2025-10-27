import { auth } from '@/lib/better-auth/auth';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import SearchCommand from '@/components/SearchCommand';
import StockScreener from '@/components/StockScreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function SearchPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  const initialStocks = await searchStocks();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search & Screen</h1>
        <p className="text-muted-foreground">
          Find stocks and discover investment opportunities
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Stock Search</TabsTrigger>
          <TabsTrigger value="screener">Stock Screener</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <SearchCommand
                  initialStocks={initialStocks}
                  placeholder="Search for stocks by symbol or company name..."
                  renderAs="button"
                  label="Search Stocks"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Popular Stocks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {initialStocks.slice(0, 9).map((stock) => (
                    <div key={stock.symbol} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{stock.symbol}</h4>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                          <p className="text-xs text-muted-foreground">{stock.exchange}</p>
                        </div>
                        <div className="text-right">
                          <a 
                            href={`/stocks/${stock.symbol}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="screener">
          <StockScreener />
        </TabsContent>
      </Tabs>
    </div>
  );
}
