import z from 'zod';

export const addAnswerSchema = z.object({
  sessionId: z.string('Session ID is required'),
  userId: z.string('User ID is required'),
  problemId: z.string('Problem ID is required'),
  skeletonCode: z.string('Answer is required'),
  tradeOffRationale: z.string().optional(),
  attemptStatus: z.string(),
  durationSec: z.number().optional(),
  version: z.number(),
});

export type AddAnswer = z.infer<typeof addAnswerSchema>;
