import { relations } from 'drizzle-orm';
import {
  jsonb,
  pgTable,
  uuid,
  varchar,
  pgEnum,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { workspaces } from 'src/workspaces/schema';
import { users } from 'src/users/schema';
import { timestamps } from 'src/utils/schema/timestamps';

export const documentStatusEnum = pgEnum('document_status', [
  'draft',
  'published',
  'archived',
  'template',
  'trashed',
]);
export const documentTypeEnum = pgEnum('document_type', [
  'page',
  'note',
  'database',
  'template',
]);

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    workspace_id: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    parent_id: uuid('parent_id').references(() => documents.id, {
      onDelete: 'set null',
    }),
    status: documentStatusEnum('status').default('draft').notNull(),
    content: jsonb('content').default('{}').notNull(),
    metadata: jsonb('metadata').default('{}'),
    version: integer('version').default(1).notNull(),
    icon: varchar('icon', { length: 255 }),
    cover_image: varchar('cover_image', { length: 1024 }),
    last_edited_by: uuid('last_edited_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...timestamps,
  },
  (table) => ({
    projectIdIdx: index('documents_workspace_id_idx').on(table.workspace_id),
    parentIdx: index('documents_parent_id_idx').on(table.parent_id),
    titleIdx: index('documents_title_idx').on(table.title),
    // Full-text search index
    // titleSearchIdx: index('documents_title_search_idx').on(
    //   sql`to_tsvector('english', ${table.title})`,
    // ),
  }),
);

// Optional: Version history table
// export const documentVersions = pgTable(
//   'document_versions',
//   {
//     id: uuid('id').primaryKey().defaultRandom().notNull(),
//     document_id: uuid('document_id')
//       .notNull()
//       .references(() => documents.id, { onDelete: 'cascade' }),
//     content: jsonb('content').notNull(),
//     metadata: jsonb('metadata').default('{}'),
//     version: integer('version').notNull(),
//     created_by: uuid('created_by').references(() => users.id, {
//       onDelete: 'set null',
//     }),
//     commit_message: text('commit_message'),
//     ...timestamps,
//   },
//   (table) => ({
//     documentIdx: index('document_versions_document_id_idx').on(
//       table.document_id,
//     ),
//     versionIdx: index('document_versions_version_idx').on(table.version),
//   }),
// );

// export const documentBlocks = pgTable('document_blocks', {
//     id: uuid('id').primaryKey().defaultRandom().notNull(),
//     document_id: uuid('document_id')
//       .notNull()
//       .references(() => documents.id, { onDelete: 'cascade' }),
//     type: varchar('type', { length: 50 }).notNull(),
//     content: jsonb('content').notNull(),
//     order: integer('order').notNull(),
//     parent_block_id: uuid('parent_block_id')
//       .references(() => documentBlocks.id, { onDelete: 'cascade' }),
//     ...timestamps
//   }, (table) => ({
//     documentIdx: index('document_blocks_document_id_idx').on(table.document_id),
//     orderIdx: index('document_blocks_order_idx').on(table.order)
//   }));
export const documentsRelations = relations(documents, ({ one }) => ({
  project: one(workspaces, {
    fields: [documents.workspace_id],
    references: [workspaces.id],
  }),
  lastEditedBy: one(users, {
    fields: [documents.last_edited_by],
    references: [users.id],
  }),
  //   versions: many(documentVersions),
}));
// export const documentVersionsRelations = relations(
//   documentVersions,
//   ({ one }) => ({
//     document: one(documents, {
//       fields: [documentVersions.document_id],
//       references: [documents.id],
//     }),
//   }),
// );
