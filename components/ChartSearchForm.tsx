'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ChartSearchForm() {
  const [symbol, setSymbol] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      router.push(`/chart/${symbol.toUpperCase().trim()}`);
    }
  };

  const handleViewChart = () => {
    if (symbol.trim()) {
      router.push(`/chart/${symbol.toUpperCase().trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input 
        placeholder="Enter stock symbol (e.g., AAPL)" 
        className="flex-1"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <Button type="submit" onClick={handleViewChart}>
        View Chart
      </Button>
    </form>
  );
}
