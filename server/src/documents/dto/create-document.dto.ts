import { CreateBlockSchema } from 'src/blocks/dto/block.dto';
import { z } from 'zod';

// Enums
export const DocumentStatusEnum = z.enum([
  'draft',
  'published',
  'archived',
  'template',
]);
export const DocumentTypeEnum = z.enum([
  'page',
  'note',
  'database',
  'template',
]);

// Create Document Schema
export const CreateDocumentSchema = z.object({
  title: z
    .string()
    .min(5, 'Document title is required')
    .max(255, 'Title cannot exceed 255 characters'),
  workspace_id: z.string().uuid('Project ID must be a valid UUID'),
  parent_id: z.string().uuid('Parent ID must be a valid UUID').optional(),
  status: DocumentStatusEnum.default('draft'),
  // content: z.record(z.any()).default({}),
  metadata: z.record(z.any()).optional(),
  version: z
    .number()
    .int()
    .positive('Version must be a positive integer')
    .default(1),
  icon: z.string().optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  lastEditedBy: z
    .string()
    .uuid('Last edited by must be a valid UUID')
    .optional(),
});

// Update Document Schema
export const UpdateDocumentSchema = CreateDocumentSchema.partial();

export class UpdateDocumentContentDto {
  content: any; // or be more specific with your Lexical JSON type if you have one
}
export const UpdateDocumentContentSchema = z.object({
  content: z.any(), // or a more specific schema for your Lexical JSON content
});

// Type Definitions
export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof UpdateDocumentSchema>;

export const CreateDocumentWithBlocksSchema = z.object({
  document: CreateDocumentSchema.optional(),
  blocks: z.array(CreateBlockSchema).default([]),
});
export type CreateDocumentWithBlocksDto = z.infer<
  typeof CreateDocumentWithBlocksSchema
>;
