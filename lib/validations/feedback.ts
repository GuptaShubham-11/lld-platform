import z from 'zod';

const criterionSchema = z.object({
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export const rubricBreakdownSchema = z.object({
  classDesign: criterionSchema,
  solidPrinciples: criterionSchema,
  tradeOffAnalysis: criterionSchema,
  extensibility: criterionSchema,
});

export const addFeedbackSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  rubricFeedback: rubricBreakdownSchema,
  keyTakeaways: z.array(z.string()),
  progressDelta: z.string(),
  evaluationStrategy: z.string().max(100).optional(),
});

export type AddFeedback = z.infer<typeof addFeedbackSchema>;
