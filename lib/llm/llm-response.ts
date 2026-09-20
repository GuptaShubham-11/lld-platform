import { addFeedbackSchema, AddFeedback } from '@/lib/validations/feedback';

export type LlmParseResult =
  | { ok: true; data: AddFeedback }
  | { ok: false; reason: 'malformed_llm_output' | 'schema_validation_failed'; detail: unknown };

export function extractJsonPayload(text: string): string {
  const fenced = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');

  const firstBrace = fenced.indexOf('{');
  const lastBrace = fenced.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return fenced; // let JSON.parse fail naturally — caller handles it
  }
  return fenced.slice(firstBrace, lastBrace + 1);
}

export function parseLlmFeedback(rawText: unknown): LlmParseResult {
  if (typeof rawText !== 'string' || rawText.trim().length === 0) {
    return { ok: false, reason: 'malformed_llm_output', detail: 'empty_or_non_string_content' };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(extractJsonPayload(rawText));
  } catch (err) {
    return { ok: false, reason: 'malformed_llm_output', detail: err };
  }

  const validated = addFeedbackSchema.safeParse(parsedJson);
  if (!validated.success) {
    return { ok: false, reason: 'schema_validation_failed', detail: validated.error.flatten() };
  }

  return { ok: true, data: validated.data };
}
