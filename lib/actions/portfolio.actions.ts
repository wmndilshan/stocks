'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Portfolio, type PortfolioPosition, type Transaction } from '@/database/models/portfolio.model';
import { getStockQuote } from './finnhub.actions';
import { revalidatePath } from 'next/cache';

export async function addTransaction(
  userId: string,
  symbol: string,
  company: string,
  transaction: Omit<Transaction, '_id'>
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();

    const existingPosition = await Portfolio.findOne({ userId, symbol });

    if (existingPosition) {
      // Update existing position
      existingPosition.transactions.push(transaction);
      
      // Recalculate average cost and quantity
      let totalCost = 0;
      let totalQuantity = 0;
      
      for (const trans of existingPosition.transactions) {
        if (trans.type === 'buy') {
          totalCost += (trans.price * trans.quantity) + (trans.fees || 0);
          totalQuantity += trans.quantity;
        } else {
          // For sells, reduce quantity but keep average cost the same
          totalQuantity -= trans.quantity;
        }
      }
      
      existingPosition.quantity = Math.max(0, totalQuantity);
      existingPosition.averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;
      existingPosition.lastUpdated = new Date();
      
      await existingPosition.save();
    } else {
      // Create new position
      if (transaction.type === 'sell') {
        return { success: false, message: 'Cannot sell stock you don\'t own' };
      }
      
      const newPosition = new Portfolio({
        userId,
        symbol: symbol.toUpperCase(),
        company,
        quantity: transaction.quantity,
        averageCost: transaction.price + ((transaction.fees || 0) / transaction.quantity),
        currentPrice: transaction.price,
        lastUpdated: new Date(),
        transactions: [transaction]
      });
      
      await newPosition.save();
    }

    revalidatePath('/portfolio');
    return { success: true, message: 'Transaction added successfully' };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, message: 'Failed to add transaction' };
  }
}

export async function getPortfolio(userId: string): Promise<PortfolioPosition[]> {
  try {
    await connectToDatabase();
    
    const positions = await Portfolio.find({ userId, quantity: { $gt: 0 } })
      .sort({ lastUpdated: -1 })
      .lean();

    // Update current prices for all positions
    const updatedPositions = await Promise.all(
      positions.map(async (position) => {
        try {
          const quote = await getStockQuote(position.symbol);
          const currentPrice = quote?.c || position.currentPrice;
          
          // Update in database
          await Portfolio.findByIdAndUpdate(position._id, {
            currentPrice,
            lastUpdated: new Date()
          });
          
          return {
            ...position,
            currentPrice,
            lastUpdated: new Date()
          };
        } catch (error) {
          console.error(`Error updating price for ${position.symbol}:`, error);
          return position;
        }
      })
    );

    return JSON.parse(JSON.stringify(updatedPositions));
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
}

export async function removePosition(userId: string, symbol: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    await Portfolio.deleteOne({ userId, symbol: symbol.toUpperCase() });
    
    revalidatePath('/portfolio');
    return { success: true, message: 'Position removed successfully' };
  } catch (error) {
    console.error('Error removing position:', error);
    return { success: false, message: 'Failed to remove position' };
  }
}

export async function getPortfolioSummary(userId: string) {
  try {
    const positions = await getPortfolio(userId);
    
    let totalValue = 0;
    let totalCost = 0;
    let totalGainLoss = 0;
    
    for (const position of positions) {
      const currentValue = position.quantity * position.currentPrice;
      const costBasis = position.quantity * position.averageCost;
      
      totalValue += currentValue;
      totalCost += costBasis;
      totalGainLoss += (currentValue - costBasis);
    }
    
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercentage,
      positionCount: positions.length
    };
  } catch (error) {
    console.error('Error calculating portfolio summary:', error);
    return {
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercentage: 0,
      positionCount: 0
    };
  }
}
