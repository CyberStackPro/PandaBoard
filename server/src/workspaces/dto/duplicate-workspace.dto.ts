import { z } from 'zod';
import { CreateWorkspaceSchema } from './create-workspace.dto';

export const DuplicateWorkspaceSchema = z.object({
  withContent: z.boolean(),
  name: z.string().min(1, 'Workspace name is required'),
  type: CreateWorkspaceSchema.shape.type,
  parent_id: CreateWorkspaceSchema.shape.parent_id,
  owner_id: CreateWorkspaceSchema.shape.owner_id,
  status: CreateWorkspaceSchema.shape.status,
  visibility: CreateWorkspaceSchema.shape.visibility,
  metadata: CreateWorkspaceSchema.shape.metadata,
  icon: z.string().optional(),
  cover_image: z.string().nullable().optional(),
});

export type DuplicateWorkspaceDto = z.infer<typeof DuplicateWorkspaceSchema>;
