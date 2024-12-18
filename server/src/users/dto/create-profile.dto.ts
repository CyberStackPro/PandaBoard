import { z } from 'zod';
import { profiles } from '../schema';

type InsertProfile = typeof profiles.$inferInsert;
type SelectProfile = typeof profiles.$inferSelect;

export const createProfileSchema = z.object({
  user_id: z.string().uuid(),
  avatar_url: z.string().optional(), // Match Drizzle field name
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  social_links: z.record(z.any()).nullable().optional(),
  preferences: z.record(z.any()).nullable().optional(),
});
export const userIdSchema = z.object({
  user_id: z.string().uuid(),
});
export const updateProfileSchema = z
  .object({
    avatar_url: z.string().optional(),
    age: z.number().min(13).max(120).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(255).optional(),
    social_links: z.record(z.string().url()).optional(),
    preferences: z.record(z.any()).optional(),
  })
  .strict();
export type CreateProfileDto = InsertProfile;
export type UpdateProfileDto = Partial<SelectProfile>;
