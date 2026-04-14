import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3333),
  FRONT_END_URL: z.url().default('http://localhost:5173'),
  PHARMA_SERVICE_URL: z.url().default('http://localhost:5001'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export const env = envSchema.parse(process.env);
