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
  project_id: z.string().uuid('Project ID must be a valid UUID'),
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

// Type Definitions
export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof UpdateDocumentSchema>;
