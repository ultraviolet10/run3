import { pgTable, text, timestamp, jsonb, uuid, boolean, integer } from 'drizzle-orm/pg-core';

export const waitlistEntries = pgTable('waitlist_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Farcaster User Data
  fid: text('fid').notNull(),
  username: text('username').notNull(),
  displayName: text('display_name'),
  pfpUrl: text('pfp_url'),
  location: text('location'),
  
  // Wallet Data
  walletAddress: text('wallet_address'),
  
  // Signature Data
  signature: text('signature').notNull(),
  signatureMessage: text('signature_message'),
  
  // Metadata
  chainId: text('chain_id'),
  clientFid: text('client_fid'),
  platformType: text('platform_type'),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Card number for waitlist position
  cardNumber: integer('card_number').notNull(),
  
  // Full context for debugging (stored as JSON)
  fullContext: jsonb('full_context'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type NewWaitlistEntry = typeof waitlistEntries.$inferInsert;
