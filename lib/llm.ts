import { GoogleGenAI } from '@google/genai';
import { env } from './env';

export const llm = new GoogleGenAI({
  apiKey: env.LLM_API_KEY,
});
