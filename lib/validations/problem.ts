import z from 'zod';

export const addProblemSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' })
    .trim()
    .toLowerCase(),

  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(1000, { message: 'Description must be at most 1000 characters long' })
    .trim(),

  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export type AddProblemSchema = z.infer<typeof addProblemSchema>;
