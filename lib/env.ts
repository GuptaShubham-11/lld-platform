import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    // LLM_API_KEY: z.string(),
  },

  client: {
    // NEXT_PUBLIC_API_URL: z.string().url('Invalid NEXT_PUBLIC_API_URL'),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // LLM_API_KEY: process.env.LLM_API_KEY,
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
