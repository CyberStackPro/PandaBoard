import { z } from 'zod';

// Enums
export const WorkspaceStatusEnum = z.enum([
  'active',
  'archived',
  'deleted',
  'template',
  'trashed',
]);
export const WorkspaceVisibilityEnum = z.enum(['private', 'team', 'public']);
export const WorkspaceTypeEnum = z.enum(['folder', 'file']);
// Create Workspace Schema
export const CreateWorkspaceSchema = z.object({
  owner_id: z
    .string({ required_error: 'Owner ID is required' })
    .uuid('Owner ID must be a valid UUID'),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Workspace name is required')
    .max(255, 'Workspace name cannot exceed 255 characters'),
  parent_id: z.string().uuid('Parent ID must be a valid UUID').nullable(),
  description: z.string().optional(),
  status: WorkspaceStatusEnum.default('active'),
  visibility: WorkspaceVisibilityEnum.default('private'),
  icon: z.string().optional(),
  type: WorkspaceTypeEnum.default('folder'),
  cover_image: z.string().url('Cover image must be a valid URL').optional(),
  metadata: z.record(z.any()).optional(),
});

// Update Workspace Schema
export const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial();

// Type Definitions
export type CreateWorkspaceDto = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof UpdateWorkspaceSchema>;
