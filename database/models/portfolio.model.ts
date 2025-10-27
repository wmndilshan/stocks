import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface PortfolioPosition extends Document {
  userId: string;
  symbol: string;
  company: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  lastUpdated: Date;
  transactions: Transaction[];
}

export interface Transaction {
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: Date;
  fees?: number;
}

const TransactionSchema = new Schema<Transaction>({
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  fees: { type: Number, default: 0, min: 0 }
});

const PortfolioSchema = new Schema<PortfolioPosition>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    averageCost: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    transactions: [TransactionSchema]
  },
  { timestamps: true }
);

// Ensure one position per user per symbol
PortfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Portfolio: Model<PortfolioPosition> =
  (models?.Portfolio as Model<PortfolioPosition>) || model<PortfolioPosition>('Portfolio', PortfolioSchema);
