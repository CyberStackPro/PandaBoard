import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { documents } from 'src/documents/schema';
import { users } from 'src/users/schema';
import { timestamps } from 'src/utils/schema/timestamps';

export const workspaceStatusEnum = pgEnum('workspace_status', [
  'active',
  'archived',
  'deleted',
  'template',
  'trashed',
]);
export const workspaceVisibilityEnum = pgEnum('workspace_visibility', [
  'private',
  'team',
  'public',
]);
export const workspaceTypeEnum = pgEnum('workspace_type', ['folder', 'file']);

export const workspaces = pgTable(
  'workspaces',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    owner_id: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // workspace_id: uuid('workspace_id').references(() => workspaces.id, {
    //   onDelete: 'cascade',
    // }),
    parent_id: uuid('parent_id').references(() => workspaces.id, {
      onDelete: 'set null',
    }),
    type: workspaceTypeEnum('type').notNull().default('folder'),
    description: text('description'),
    status: workspaceStatusEnum('status').default('active'),
    visibility: workspaceVisibilityEnum('visibility')
      .default('private')
      .notNull(),
    metadata: jsonb('metadata').default('{}'),
    icon: varchar('icon', { length: 255 }),
    cover_image: varchar('cover_image', { length: 1024 }),
    restored_at: timestamp('restored_at', { mode: 'date' }),
    permanent_deleted_at: timestamp('permanent_deleted_at'),
    deleted_by: uuid('deleted_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    path: text('path'),
    sort_order: integer('sort_order').notNull().default(0),
    favorite: boolean('favorite').default(false),
    ...timestamps,
  },
  (table) => ({
    ownerIdx: index('workspaces_owner_id_idx').on(table.owner_id),
    // workspaceIdx: index('workspaces_workspace_id_idx').on(table.workspace_id),
    parentIdx: index('workspaces_parent_id_idx').on(table.parent_id),
  }),
);

// export const projectCollaborators = pgTable(
//   'project_collaborators',
//   {
//     id: uuid('id').primaryKey().defaultRandom().notNull(),
//     project_id: uuid('project_id')
//       .notNull()
//       .references(() => projects.id, { onDelete: 'cascade' }),
//     user_id: uuid('user_id')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     role: rolesEnum('role').default('viewer').notNull(),
//     permissions: jsonb('permissions').default('{}'),
//     last_accessed: timestamp('last_accessed', { mode: 'date' }),
//     ...timestamps,
//   },
//   (table) => ({
//     // Ensure unique collaborator per project
//     uniqueCollaborator: uniqueIndex('unique_project_collaborator').on(
//       table.project_id,
//       table.user_id,
//     ),
//     projectIdx: index('project_collaborators_project_id_idx').on(
//       table.project_id,
//     ),
//     userIdx: index('project_collaborators_user_id_idx').on(table.user_id),
//   }),
// );
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.owner_id],
    references: [users.id],
  }),
  parent: one(workspaces, {
    fields: [workspaces.parent_id],
    references: [workspaces.id],
    relationName: 'parent_child',
  }),
  children: many(workspaces, {
    relationName: 'parent_child',
  }),
  documents: many(documents),
  deletedBy: one(users, {
    fields: [workspaces.deleted_by],
    references: [users.id],
  }),
}));

// export const projectCollaboratorsRelations = relations(
//   projectCollaborators,
//   ({ one }) => ({
//     project: one(projects, {
//       fields: [projectCollaborators.project_id],
//       references: [projects.id],
//     }),
//     user: one(users, {
//       fields: [projectCollaborators.user_id],
//       references: [users.id],
//     }),
//   }),
// );

export type InsertProject = typeof workspaces.$inferInsert;
export type SelectProject = typeof workspaces.$inferSelect;
