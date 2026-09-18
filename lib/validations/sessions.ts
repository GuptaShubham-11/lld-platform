import z from 'zod';

export const startSessionSchema = z.object({
  problemId: z.string(),
  userId: z.string(),
});

export type StartSessionSchema = z.infer<typeof startSessionSchema>;
