import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { documents } from 'src/documents/schema';
import { users } from 'src/users/schema';
import { timestamps } from 'src/utils/schema/timestamps';

export const projectStatusEnum = pgEnum('project_status', [
  'active',
  'archived',
  'deleted',
  'template',
]);
export const projectVisibilityEnum = pgEnum('project_visibility', [
  'private',
  'team',
  'public',
]);
export const projectTypeEnum = pgEnum('project_type', ['folder', 'file']);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    owner_id: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // workspace_id: uuid('workspace_id').references(() => workspaces.id, {
    //   onDelete: 'cascade',
    // }),
    parent_id: uuid('parent_id').references(() => projects.id, {
      onDelete: 'set null',
    }),
    type: projectTypeEnum('type').notNull().default('folder'),
    description: text('description'),
    status: projectStatusEnum('status').default('active'),
    visibility: projectVisibilityEnum('visibility')
      .default('private')
      .notNull(),
    metadata: jsonb('metadata').default('{}'),
    icon: varchar('icon', { length: 255 }),
    cover_image: varchar('cover_image', { length: 1024 }),
    ...timestamps,
  },
  (table) => ({
    ownerIdx: index('projects_owner_id_idx').on(table.owner_id),
    // workspaceIdx: index('projects_workspace_id_idx').on(table.workspace_id),
    parentIdx: index('projects_parent_id_idx').on(table.parent_id),
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
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.owner_id],
    references: [users.id],
  }),
  parent: one(projects, {
    fields: [projects.parent_id],
    references: [projects.id],
    relationName: 'parent_child',
  }),
  children: many(projects, {
    relationName: 'parent_child',
  }),
  documents: many(documents),
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

export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;
