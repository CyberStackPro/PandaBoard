// import { drizzle } from 'drizzle-orm/node-postgres';
// import { migrate } from 'drizzle-orm/node-postgres/migrator'; // Use the node-postgres migrator
// import { Pool } from 'pg';
// import { resolve } from 'node:path';
// // import * as dotenv from 'dotenv';

// // dotenv.config();

// const migrationClient = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// async function main() {
//   const db = drizzle(migrationClient); // Create the db client
//   console.log('Starting migration...');
//   await migrate(db, { migrationsFolder: resolve(__dirname, 'src/drizzle') }); // Migrate using node-postgres migrator
//   console.log('Migration completed successfully');
//   await migrationClient.end();
// }

// main();

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: './drizzle',
    });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

main();
