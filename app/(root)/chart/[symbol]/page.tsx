import TradingViewChartPage from '@/components/TradingViewChartPage';

interface Props {
  params: Promise<{ symbol: string }>;
}

export default async function ChartPage({ params }: Props) {
  const { symbol } = await params;
  
  return <TradingViewChartPage symbol={symbol.toUpperCase()} />;
}
