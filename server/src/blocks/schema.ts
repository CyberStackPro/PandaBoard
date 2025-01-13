import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
} from 'drizzle-orm/pg-core';
import { documents } from 'src/documents/schema';
import { timestamps } from 'src/utils/schema/timestamps';

export const blockTypeEnum = pgEnum('block_type', [
  'text',
  'heading',
  'list',
  'quote',
  'code',
  'image',
  'table',
]);

export const blocks = pgTable(
  'blocks',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    document_id: uuid('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    type: blockTypeEnum('type').notNull(),
    content: jsonb('content').notNull(), // Lexical node structure
    sort_order: integer('sort_order').notNull(),
    parent_block_id: uuid('parent_block_id').references(() => blocks.id, {
      onDelete: 'cascade',
    }),
    ...timestamps,
  },
  (table) => ({
    documentIdIdx: index('blocks_document_id_idx').on(table.document_id),
    sortOrderIdx: index('blocks_sort_order_idx').on(table.sort_order),
  }),
);

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  document: one(documents, {
    fields: [blocks.document_id],
    references: [documents.id],
  }),
  parentBlock: one(blocks, {
    fields: [blocks.parent_block_id],
    references: [blocks.id],
  }),
  childBlocks: many(blocks),
}));
