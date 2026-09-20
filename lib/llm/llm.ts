// import { GoogleGenAI } from '@google/genai';
import { env } from '../env';
import { OpenRouter } from '@openrouter/sdk';

// export const llm = new GoogleGenAI({
//   apiKey: env.LLM_API_KEY,
// });

export const llm = new OpenRouter({
  apiKey: env.LLM_API_KEY,
});
