'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Bell, Search, Plus, PieChart, Target, Calculator, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      title: 'Search Stocks',
      description: 'Find and analyze stocks',
      icon: Search,
      href: '/search',
      color: 'text-blue-600',
    },
    {
      title: 'Add Transaction',
      description: 'Record buy/sell transactions',
      icon: Plus,
      href: '/portfolio',
      color: 'text-green-600',
    },
    {
      title: 'Create Alert',
      description: 'Set price notifications',
      icon: Bell,
      href: '/alerts',
      color: 'text-yellow-600',
    },
    {
      title: 'View Portfolio',
      description: 'Track your investments',
      icon: PieChart,
      href: '/portfolio',
      color: 'text-purple-600',
    },
    {
      title: 'Watchlist',
      description: 'Monitor favorite stocks',
      icon: TrendingUp,
      href: '/watchlist',
      color: 'text-indigo-600',
    },
    {
      title: 'Stock Screener',
      description: 'Filter stocks by criteria',
      icon: Target,
      href: '/search?tab=screener',
      color: 'text-red-600',
    },
    {
      title: 'Trading Tools',
      description: 'Position calculator & analysis',
      icon: Calculator,
      href: '/tools',
      color: 'text-orange-600',
    },
    {
      title: 'Economic Calendar',
      description: 'Important economic events',
      icon: Calendar,
      href: '/tools?tab=calendar',
      color: 'text-cyan-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
                >
                  <Icon className={`h-6 w-6 ${action.color}`} />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
