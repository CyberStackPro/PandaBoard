import { z } from 'zod';
import { CreateProjectSchema } from './create-project.dto';

export const DuplicateProjectSchema = z.object({
  withContent: z.boolean(),
  name: z.string().min(1, 'Project name is required'),
  type: CreateProjectSchema.shape.type,
  parent_id: CreateProjectSchema.shape.parent_id,
  owner_id: CreateProjectSchema.shape.owner_id,
  status: CreateProjectSchema.shape.status,
  visibility: CreateProjectSchema.shape.visibility,
  metadata: CreateProjectSchema.shape.metadata,
  icon: z.string().optional(),
  cover_image: z.string().nullable().optional(),
});

export type DuplicateProjectDto = z.infer<typeof DuplicateProjectSchema>;
