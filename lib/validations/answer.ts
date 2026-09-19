import z from 'zod';

export const addAnswerSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters long' }),
  skeletonCode: z.string('Answer is required'),
  tradeOffRationale: z.string().optional(),
  attemptStatus: z.string(),
  durationSec: z.number().optional(),
});

export type AddAnswer = z.infer<typeof addAnswerSchema>;
