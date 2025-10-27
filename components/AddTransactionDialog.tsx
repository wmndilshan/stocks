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
import { addTransaction } from '@/lib/actions/portfolio.actions';
import { toast } from 'sonner';
import { useSession } from '@/lib/better-auth/client';

const transactionSchema = z.object({
  type: z.enum(['buy', 'sell']),
  symbol: z.string().min(1, 'Symbol is required'),
  company: z.string().min(1, 'Company name is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  fees: z.number().min(0, 'Fees cannot be negative').optional(),
  date: z.string(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface AddTransactionDialogProps {
  children: React.ReactNode;
}

export default function AddTransactionDialog({ children }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; company: string } | null>(null);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'buy',
      date: new Date().toISOString().split('T')[0],
      fees: 0,
    },
  });

  const watchedType = watch('type');

  const onSubmit = async (data: TransactionForm) => {
    if (!selectedStock) {
      toast.error('Please select a stock');
      return;
    }

    if (!session?.user) {
      toast.error('Please sign in to add transactions');
      return;
    }

    setIsLoading(true);
    try {
      const transaction = {
        type: data.type,
        quantity: data.quantity,
        price: data.price,
        date: new Date(data.date),
        fees: data.fees || 0,
      };

      const result = await addTransaction(
        session.user.id,
        selectedStock.symbol,
        selectedStock.company,
        transaction
      );

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        reset();
        setSelectedStock(null);
      } else {
        toast.error(result.message);
      }    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast.error('Failed to add transaction');
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
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a buy or sell transaction to your portfolio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              onValueChange={(value) => setValue('type', value as 'buy' | 'sell')}
              defaultValue="buy"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

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
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Share</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fees">Fees (Optional)</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                {...register('fees', { valueAsNumber: true })}
              />
              {errors.fees && (
                <p className="text-sm text-red-500">{errors.fees.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
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
              {isLoading ? 'Adding...' : `${watchedType === 'buy' ? 'Buy' : 'Sell'} Stock`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
