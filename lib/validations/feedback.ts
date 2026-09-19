import z from 'zod';

const criterionSchema = z.object({
  score: z.number().int().min(0),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export const rubricFeedbackSchema = z.object({
  overallScore: z.number().int(),
  rubricFeedback: z.object({
    classDesign: criterionSchema,
    solidPrinciples: criterionSchema,
    tradeOffAnalysis: criterionSchema,
    extensibility: criterionSchema,
  }),
  keyTakeaways: z.array(z.string()),
  progressDelta: z.string(),
});

export const addFeedbackSchema = z.object({
  answerId: z.string().uuid(),
  overallScore: z.number().int(),
  rubricFeedback: rubricFeedbackSchema,
  evaluationStrategy: z.string().max(100),
});
