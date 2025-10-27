import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface PriceAlert extends Document {
  userId: string;
  symbol: string;
  company: string;
  alertType: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  notificationMethod: 'email' | 'push' | 'both';
}

const PriceAlertSchema = new Schema<PriceAlert>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    alertType: { type: String, enum: ['above', 'below'], required: true },
    targetPrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    isTriggered: { type: Boolean, default: false },
    triggeredAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    notificationMethod: { type: String, enum: ['email', 'push', 'both'], default: 'email' }
  },
  { timestamps: true }
);

PriceAlertSchema.index({ userId: 1, symbol: 1, alertType: 1, targetPrice: 1 });
PriceAlertSchema.index({ isActive: 1, isTriggered: 1 });

export const PriceAlert: Model<PriceAlert> =
  (models?.PriceAlert as Model<PriceAlert>) || model<PriceAlert>('PriceAlert', PriceAlertSchema);
