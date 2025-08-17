# Waitlist System Documentation

## Overview
A complete PostgreSQL-based waitlist system for storing Farcaster user signups with signature verification.

## Database Schema

### `waitlist_entries` Table
- `id` (UUID) - Primary key
- `fid` (TEXT) - Farcaster ID (unique)
- `username` (TEXT) - Farcaster username
- `display_name` (TEXT) - User's display name
- `pfp_url` (TEXT) - Profile picture URL
- `location` (TEXT) - User location
- `wallet_address` (TEXT) - Connected wallet address
- `signature` (TEXT) - Cryptographic signature
- `signature_message` (TEXT) - Message that was signed
- `chain_id` (TEXT) - Blockchain network
- `client_fid` (TEXT) - Client Farcaster ID
- `platform_type` (TEXT) - Platform type (web, mobile, etc.)
- `is_active` (BOOLEAN) - Entry status
- `full_context` (JSONB) - Complete Farcaster context
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## API Endpoints

### POST `/api/waitlist`
Add a new user to the waitlist.

**Request Body:**
```json
{
  "fid": "12345",
  "username": "username",
  "displayName": "Display Name",
  "pfpUrl": "https://...",
  "location": "Location",
  "walletAddress": "0x...",
  "signature": "0x...",
  "signatureMessage": "Join waitlist...",
  "chainId": "base",
  "clientFid": "67890",
  "platformType": "web",
  "fullContext": {...}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "id": "uuid"
}
```

### GET `/api/waitlist?fid=12345`
Check if a user is in the waitlist.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fid": "12345",
    "username": "username",
    ...
  }
}
```

### GET `/api/waitlist/stats`
Get waitlist statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 145
  }
}
```

## Usage

### In Components
```tsx
import { useWaitlist } from '~/hooks/useWaitlist';

const { submitToWaitlist, isSubmitting, error } = useWaitlist();

const handleJoin = async () => {
  const result = await submitToWaitlist(waitlistData);
  if (result.success) {
    console.log('Joined waitlist:', result.id);
  }
};
```

### Database Operations
```tsx
import { addToWaitlist, getWaitlistEntry } from '~/lib/waitlist';

// Add user
const result = await addToWaitlist(userData);

// Check user
const entry = await getWaitlistEntry(fid);
```

## Setup Instructions

1. **Environment Variables**
   Add `DATABASE_URL` to your `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Run Migrations**
   ```bash
   bun run db:generate  # Generate migration files
   bun run db:migrate   # Apply migrations
   ```

3. **Development**
   ```bash
   bun run db:studio    # Open Drizzle Studio
   ```

## Features

- ✅ PostgreSQL database with Drizzle ORM
- ✅ Unique constraint on Farcaster ID
- ✅ Signature verification and storage
- ✅ Complete user profile data capture
- ✅ RESTful API endpoints
- ✅ TypeScript support
- ✅ Error handling and validation
- ✅ React hooks for easy integration
- ✅ Database indexing for performance
- ✅ JSONB storage for flexible context data

## Security Considerations

- Signatures are verified before storage
- Unique constraints prevent duplicate entries
- Input validation using Zod schemas
- Environment variables for database credentials
- SSL support for production databases
