import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
import * as userSchema from '../users/schema';
import * as projects from 'src/workspaces/schema';
import * as documents from 'src/documents/schema';
import * as blocks from 'src/blocks/schema';
import { Pool } from 'pg';
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configServices: ConfigService) => {
        const pool = new Pool({
          connectionString: configServices.getOrThrow('DATABASE_URL'),
        });

        return drizzle(pool, {
          schema: { ...userSchema, ...projects, ...documents, ...blocks },
        });
        // return drizzle(configServices.getOrThrow('DATABASE_URL'), {
        //   schema: { ...userSchema, ...projects, ...documents },
        // });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
