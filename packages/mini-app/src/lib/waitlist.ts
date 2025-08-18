import { getDb } from './db/connection';
import { waitlistEntries, type NewWaitlistEntry } from './db/schema';
import { eq, max } from 'drizzle-orm';

export interface WaitlistData {
  // User Profile Data
  fid: string;
  username: string;
  displayName?: string;
  pfpUrl?: string;
  location?: string;

  // Wallet Data
  walletAddress?: string;

  // Signature Data
  signature: string;
  signatureMessage?: string;

  // Metadata
  chainId?: string;
  clientFid?: string;
  platformType?: string;

  // Full context for debugging
  fullContext?: any;
}

export async function addToWaitlist(data: WaitlistData): Promise<{ success: boolean; id?: string; cardNumber?: number; error?: string }> {
  try {
    const db = getDb();

    // Check if user already exists in waitlist
    const existingEntry = await db
      .select()
      .from(waitlistEntries)
      .where(eq(waitlistEntries.fid, data.fid))
      .limit(1);

    if (existingEntry.length > 0) {
      return {
        success: false,
        error: 'User already exists in waitlist'
      };
    }

    // Get the next card number by finding the maximum existing card number
    const maxCardResult = await db
      .select({ maxCard: max(waitlistEntries.cardNumber) })
      .from(waitlistEntries);

    const nextCardNumber = (maxCardResult[0]?.maxCard || 0) + 1;

    // Insert new waitlist entry
    const newEntry: NewWaitlistEntry = {
      fid: data.fid,
      username: data.username,
      displayName: data.displayName,
      pfpUrl: data.pfpUrl,
      location: data.location,
      walletAddress: data.walletAddress,
      signature: data.signature,
      signatureMessage: data.signatureMessage,
      chainId: data.chainId,
      clientFid: data.clientFid,
      platformType: data.platformType,
      cardNumber: nextCardNumber,
      fullContext: data.fullContext,
    };

    const result = await db
      .insert(waitlistEntries)
      .values(newEntry)
      .returning({ id: waitlistEntries.id, cardNumber: waitlistEntries.cardNumber });

    return {
      success: true,
      id: result[0].id,
      cardNumber: result[0].cardNumber
    };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getWaitlistEntry(fid: string) {
  try {
    const db = getDb();
    
    const entry = await db
      .select()
      .from(waitlistEntries)
      .where(eq(waitlistEntries.fid, fid))
      .limit(1);

    return entry[0] || null;
  } catch (error) {
    console.error('Error getting waitlist entry:', error);
    return null;
  }
}

export async function getWaitlistStats() {
  try {
    const db = getDb();
    
    const totalEntries = await db
      .select({ count: waitlistEntries.id })
      .from(waitlistEntries);

    return {
      total: totalEntries.length,
      active: totalEntries.filter(entry => entry.count).length
    };
  } catch (error) {
    console.error('Error getting waitlist stats:', error);
    return { total: 0, active: 0 };
  }
}
