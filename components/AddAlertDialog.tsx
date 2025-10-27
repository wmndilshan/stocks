'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchCommand from '@/components/SearchCommand';
import { createPriceAlert } from '@/lib/actions/alert.actions';
import { toast } from 'sonner';
import { useSession } from '@/lib/better-auth/client';

const alertSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  company: z.string().min(1, 'Company name is required'),
  alertType: z.enum(['above', 'below']),
  targetPrice: z.number().min(0.01, 'Target price must be greater than 0'),
  notificationMethod: z.enum(['email', 'push', 'both']),
});

type AlertForm = z.infer<typeof alertSchema>;

interface AddAlertDialogProps {
  children: React.ReactNode;
}

export default function AddAlertDialog({ children }: AddAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; company: string } | null>(null);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AlertForm>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alertType: 'above',
      notificationMethod: 'email',
    },
  });

  const onSubmit = async (data: AlertForm) => {
    if (!selectedStock) {
      toast.error('Please select a stock');
      return;
    }

    if (!session?.user) {
      toast.error('Please sign in to create alerts');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPriceAlert(
        session.user.id,
        selectedStock.symbol,
        selectedStock.company,
        data.alertType,
        data.targetPrice,
        data.notificationMethod
      );

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        reset();
        setSelectedStock(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to create alert:', error);
      toast.error('Failed to create alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = (stock: { symbol: string; company: string }) => {
    setSelectedStock(stock);
    setValue('symbol', stock.symbol);
    setValue('company', stock.company);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            Get notified when a stock reaches your target price
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Stock</Label>
            <SearchCommand
              onSelect={handleStockSelect}
              placeholder="Search for a stock..."
            />
            {selectedStock && (
              <div className="text-sm text-muted-foreground">
                Selected: {selectedStock.symbol} - {selectedStock.company}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alertType">Alert Type</Label>
              <Select
                onValueChange={(value) => setValue('alertType', value as 'above' | 'below')}
                defaultValue="above"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                </SelectContent>
              </Select>
              {errors.alertType && (
                <p className="text-sm text-red-500">{errors.alertType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('targetPrice', { valueAsNumber: true })}
              />
              {errors.targetPrice && (
                <p className="text-sm text-red-500">{errors.targetPrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationMethod">Notification Method</Label>
            <Select
              onValueChange={(value) => setValue('notificationMethod', value as 'email' | 'push' | 'both')}
              defaultValue="email"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notification method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            {errors.notificationMethod && (
              <p className="text-sm text-red-500">{errors.notificationMethod.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedStock}>
              {isLoading ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
