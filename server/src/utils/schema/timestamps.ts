import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  deleted_at: timestamp('deleted_at', { mode: 'date' }),
};

export type Timestamps = typeof timestamps;

// Trigger function for updated_at
export const createUpdatedAtTrigger = (tableName: string) => `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER update_${tableName}_updated_at
      BEFORE UPDATE ON ${tableName}
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
`;
