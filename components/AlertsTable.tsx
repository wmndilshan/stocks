'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoreHorizontal, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteAlert, toggleAlert } from '@/lib/actions/alert.actions';
import { toast } from 'sonner';
import type { PriceAlert } from '@/database/models/price-alert.model';

interface AlertsTableProps {
  alerts: PriceAlert[];
  userId: string;
}

export default function AlertsTable({ alerts, userId }: AlertsTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No alerts yet</h3>
            <p className="text-muted-foreground">Create your first price alert to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteAlert = async (alertId: string) => {
    setIsLoading(alertId);
    try {
      const result = await deleteAlert(alertId, userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete alert');
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleAlert = async (alertId: string) => {
    setIsLoading(alertId);
    try {
      const result = await toggleAlert(alertId, userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to toggle alert');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const alertTriggered = alert.isTriggered;
        const alertActive = alert.isActive;

        return (
          <Card key={alert._id} className={`hover:shadow-md transition-shadow ${alertTriggered ? 'border-green-200 bg-green-50/50' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/stocks/${alert.symbol}`}
                    className="hover:underline"
                  >
                    <CardTitle className="text-lg">{alert.symbol}</CardTitle>
                  </Link>
                  <Badge variant="outline">{alert.company}</Badge>
                  {alertTriggered && (
                    <Badge variant="default" className="bg-green-600">
                      Triggered
                    </Badge>
                  )}
                  {!alertActive && !alertTriggered && (
                    <Badge variant="secondary">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={alertActive}
                    onCheckedChange={() => handleToggleAlert(alert._id)}
                    disabled={isLoading === alert._id || alertTriggered}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isLoading === alert._id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteAlert(alert._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Alert
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Alert Type</p>
                  <div className="flex items-center space-x-1">
                    {alert.alertType === 'above' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-lg font-semibold capitalize">
                      {alert.alertType}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Price</p>
                  <p className="text-lg font-semibold">
                    ${alert.targetPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-semibold">
                    ${alert.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">
                    {alertTriggered ? (
                      <span className="text-green-600">Triggered</span>
                    ) : alertActive ? (
                      <span className="text-blue-600">Active</span>
                    ) : (
                      <span className="text-gray-600">Inactive</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  {alertTriggered && alert.triggeredAt && (
                    <span>Triggered: {new Date(alert.triggeredAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
