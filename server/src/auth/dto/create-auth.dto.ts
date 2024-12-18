import { z } from 'zod';

export const userRole = z.enum(['owner', 'admin', 'editor', 'viewer', 'guest']);

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),
  email: z.string({ required_error: 'Email is required' }).email().max(255),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 5 characters long' })
    .max(1025),
  role: userRole.optional(),
});

export const signInSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email().max(255),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 5 characters long' })
    .max(1025),
});

export const UpdateUserSchema = signUpSchema.partial();

export type SignInDto = z.infer<typeof signInSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;
