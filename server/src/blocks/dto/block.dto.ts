// blocks/dto/block.dto.ts
import { z } from 'zod';

// Improved Block Schema
// export const CreateBlockSchema = z.object({
//   document_id: z.string().uuid(),
//   type: z.enum(['text', 'heading', 'list', 'quote', 'code', 'image', 'table']),
//   content: z.object({
//     type: z.string(),
//     version: z.number(),
//     format: z.string().optional(),
//     indent: z.number().optional(),
//     direction: z.enum(['ltr', 'rtl', null]).optional(),
//     tag: z.string().optional(), // For headings (h1, h2, etc.)
//     text: z.string().optional(), // For text nodes
//     style: z.string().optional(),
//     mode: z.string().optional(),
//     children: z.array(z.lazy(() => CreateBlockSchema)).optional(),
//     textFormat: z.number().optional(),
//     textStyle: z.string().optional(),
//     listType: z.enum(['bullet', 'number']).optional(), // For lists
//     url: z.string().url().optional(), // For links
//   }).passthrough(),
//   sort_order: z.number(),
//   parent_block_id: z.string().uuid().optional(),
// });
export const CreateBlockSchema = z.object({
  document_id: z.string().uuid(),
  // type: z.enum(['text', 'heading', 'list', 'quote', 'code', 'image', 'table']),
  // .optional(),
  // content: z
  //   .object({
  //     // Lexical node structure
  //     type: z.string(),
  //     version: z.number(),
  //     format: z.string().optional(),
  //     indent: z.number().optional(),
  //     direction: z
  //       .union([z.literal('ltr'), z.literal('rtl'), z.null()])
  //       .optional(),
  //     tag: z.string().optional(),
  //     text: z.string().optional(),
  //     style: z.string().optional(),
  //     mode: z.string().optional(),
  //     value: z.any(),
  //     children: z.array(z.any()).optional(),
  //     textFormat: z.number().optional(),
  //     textStyle: z.string().optional(),
  //     listType: z.enum(['bullet', 'number']).optional(), // For lists
  //     url: z.string().url().optional(), // For links
  //   })
  //   .passthrough(),
  content: z.record(z.any()), // More flexible content structure
  // .passthrough(),
  // sort_order: z.number(),
  parent_block_id: z.string().uuid().optional(),
});

export type CreateBlockDto = z.infer<typeof CreateBlockSchema>;

export const UpdateBlockSchema = CreateBlockSchema.partial();
export type UpdateBlockDto = z.infer<typeof UpdateBlockSchema>;
