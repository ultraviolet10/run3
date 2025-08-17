import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getDb } from './db/connection';
import path from 'path';

export async function runMigrations() {
  try {
    const db = getDb();
    
    console.log('Running database migrations...');
    
    await migrate(db, { 
      migrationsFolder: path.join(process.cwd(), 'drizzle') 
    });
    
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
