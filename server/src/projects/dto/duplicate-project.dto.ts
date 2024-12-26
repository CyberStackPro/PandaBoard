import { z } from 'zod';
import { CreateProjectSchema } from './create-project.dto';

export const DuplicateProjectSchema = z.object({
  withContent: z.boolean(),
  name: CreateProjectSchema.shape.name,
  owner_id: CreateProjectSchema.shape.owner_id,
  type: CreateProjectSchema.shape.type,
  parent_id: CreateProjectSchema.shape.parent_id,
  status: CreateProjectSchema.shape.status,
  visibility: CreateProjectSchema.shape.visibility,
  metadata: CreateProjectSchema.shape.metadata,
  icon: CreateProjectSchema.shape.icon,
  cover_image: CreateProjectSchema.shape.cover_image,
});

export type DuplicateProjectDto = z.infer<typeof DuplicateProjectSchema>;
