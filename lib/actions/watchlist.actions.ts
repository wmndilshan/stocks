'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getWatchlist(userId: string) {
  try {
    await connectToDatabase();
    
    const watchlist = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
}

export async function addToWatchlist(
  userId: string,
  symbol: string,
  company: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    // Check if already exists
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (existing) {
      return { success: false, message: 'Stock is already in your watchlist' };
    }
    
    const watchlistItem = new Watchlist({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date()
    });
    
    await watchlistItem.save();
    return { success: true, message: 'Added to watchlist' };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { success: false, message: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(
  userId: string,
  symbol: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    return { success: true, message: 'Removed from watchlist' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, message: 'Failed to remove from watchlist' };
  }
}

export async function isInWatchlist(userId: string, symbol: string): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const item = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    return !!item;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
}
