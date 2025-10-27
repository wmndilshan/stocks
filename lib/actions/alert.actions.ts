'use server';

import { connectToDatabase } from '@/database/mongoose';
import { PriceAlert } from '@/database/models/price-alert.model';
import { getStockQuote } from './finnhub.actions';
import { sendEmail } from '@/lib/nodemailer';
import { revalidatePath } from 'next/cache';

export async function createPriceAlert(
  userId: string,
  symbol: string,
  company: string,
  alertType: 'above' | 'below',
  targetPrice: number,
  notificationMethod: 'email' | 'push' | 'both' = 'email'
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();

    // Get current price
    const quote = await getStockQuote(symbol);
    if (!quote) {
      return { success: false, message: 'Unable to fetch current stock price' };
    }

    // Validate alert logic
    if (alertType === 'above' && targetPrice <= quote.c) {
      return { success: false, message: 'Target price must be above current price for "above" alerts' };
    }
    if (alertType === 'below' && targetPrice >= quote.c) {
      return { success: false, message: 'Target price must be below current price for "below" alerts' };
    }

    const alert = new PriceAlert({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      alertType,
      targetPrice,
      currentPrice: quote.c,
      notificationMethod,
      isActive: true,
      isTriggered: false
    });

    await alert.save();
    
    revalidatePath('/alerts');
    return { success: true, message: 'Price alert created successfully' };
  } catch (error) {
    console.error('Error creating price alert:', error);
    return { success: false, message: 'Failed to create price alert' };
  }
}

export async function getUserAlerts(userId: string, activeOnly: boolean = true) {
  try {
    await connectToDatabase();
    
    const filter: any = { userId };
    if (activeOnly) {
      filter.isActive = true;
      filter.isTriggered = false;
    }
    
    const alerts = await PriceAlert.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(alerts));
  } catch (error) {
    console.error('Error fetching user alerts:', error);
    return [];
  }
}

export async function deleteAlert(alertId: string, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    await PriceAlert.deleteOne({ _id: alertId, userId });
    
    revalidatePath('/alerts');
    return { success: true, message: 'Alert deleted successfully' };
  } catch (error) {
    console.error('Error deleting alert:', error);
    return { success: false, message: 'Failed to delete alert' };
  }
}

export async function toggleAlert(alertId: string, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    const alert = await PriceAlert.findOne({ _id: alertId, userId });
    if (!alert) {
      return { success: false, message: 'Alert not found' };
    }
    
    alert.isActive = !alert.isActive;
    await alert.save();
    
    revalidatePath('/alerts');
    return { success: true, message: `Alert ${alert.isActive ? 'activated' : 'deactivated'}` };
  } catch (error) {
    console.error('Error toggling alert:', error);
    return { success: false, message: 'Failed to toggle alert' };
  }
}

export async function checkPriceAlerts() {
  try {
    await connectToDatabase();
    
    const activeAlerts = await PriceAlert.find({
      isActive: true,
      isTriggered: false
    });

    const triggeredAlerts = [];
    
    for (const alert of activeAlerts) {
      try {
        const quote = await getStockQuote(alert.symbol);
        if (!quote) continue;
        
        const currentPrice = quote.c;
        let shouldTrigger = false;
        
        if (alert.alertType === 'above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.alertType === 'below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        }
        
        if (shouldTrigger) {
          alert.isTriggered = true;
          alert.triggeredAt = new Date();
          alert.currentPrice = currentPrice;
          await alert.save();
          
          triggeredAlerts.push(alert);
          
          // Send notification
          if (alert.notificationMethod === 'email' || alert.notificationMethod === 'both') {
            // TODO: Send email notification
            console.log(`Email alert triggered for ${alert.symbol} at $${currentPrice}`);
          }
        }
      } catch (error) {
        console.error(`Error checking alert for ${alert.symbol}:`, error);
      }
    }
    
    return triggeredAlerts;
  } catch (error) {
    console.error('Error checking price alerts:', error);
    return [];
  }
}
