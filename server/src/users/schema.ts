import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { projects } from 'src/workspaces/schema';
import { timestamps } from 'src/utils/schema/timestamps';

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'inactive',
  'suspended',
  'pending_verification',
]);
export const rolesEnum = pgEnum('roles', [
  'owner',
  'admin',
  'editor',
  'viewer',
  'guest',
]);
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    email_verified: boolean('email_verified').default(false).notNull(),
    role: rolesEnum('role').default('owner').notNull(),
    password: varchar('password', { length: 1024 }).notNull(),
    status: userStatusEnum('status').default('pending_verification').notNull(),
    last_login: timestamp('last_login', { mode: 'date' }).defaultNow(),
    login_count: integer('login_count').default(0).notNull(),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    statusRoleIdx: index('users_status_role_idx').on(table.status, table.role),
  }),
);

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    avatar_url: varchar('avatar_url', { length: 1024 }),
    bio: text('bio'),
    location: varchar('location', { length: 255 }),
    age: integer('age'),
    social_links: jsonb('social_links').default('{}'),
    preferences: jsonb('preferences').default('{}'),
    ...timestamps,
  },
  (table) => ({
    userIdIdx: uniqueIndex('profiles_user_id_idx').on(table.user_id),
  }),
);

// export const auditLogs = pgTable('audit_logs', {
//   id: uuid('id').primaryKey().defaultRandom().notNull(),
//   user_id: uuid('user_id')
//     .notNull()
//     .references(() => users.id),
//   action: varchar('action', { length: 255 }).notNull(),
//   table_name: varchar('table_name', { length: 255 }).notNull(),
//   changes: jsonb('changes').default('{}'),
//   timestamp: timestamp('timestamp').defaultNow().notNull(),
// });

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.user_id],
  }),
  ownedProjects: many(projects), // Add relation to owned projects
  // collaborations: many(projectCollaborators), // Add relation to project collaborations
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.user_id], references: [users.id] }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type SelectProfile = typeof profiles.$inferSelect;
export type Role = typeof rolesEnum;
