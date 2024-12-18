import { z } from 'zod';

// Enums
export const ProjectStatusEnum = z.enum([
  'active',
  'archived',
  'deleted',
  'template',
]);
export const ProjectVisibilityEnum = z.enum(['private', 'team', 'public']);

// Create Project Schema
export const CreateProjectSchema = z.object({
  owner_id: z.string().uuid('Owner ID must be a valid UUID'),
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(255, 'Project name cannot exceed 255 characters'),
  description: z.string().optional(),
  status: ProjectStatusEnum.default('active'),
  visibility: ProjectVisibilityEnum.default('private'),
  icon: z.string().optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  metadata: z.record(z.any()).optional(),
});

// Update Project Schema
export const UpdateProjectSchema = CreateProjectSchema.partial();

// Type Definitions
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
