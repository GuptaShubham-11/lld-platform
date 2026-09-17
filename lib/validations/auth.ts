import z from 'zod';

export const authSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 5 characters long' })
    .max(10, { message: 'Password must be at most 10 characters long' })
    .trim(),
});

export type AuthSchema = z.infer<typeof authSchema>;
