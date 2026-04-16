import { z } from "zod";

const parsedEnvSchema = z.object({
  MONGODB_URI: z.string().optional().default(""),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_PORT: z.string().optional().default(""),
  LOKI_TOKEN: z.string().optional().default(""),
  LOKI_USER: z.string().optional().default(""),
  LOKI_URL: z.string().optional().default(""),
  LOKI_NAME: z.string().optional().default(""),
  LOKI_ENV: z.string().optional().default(""),
});

const parsedClientEnvSchema = z.object({
  // NEXT_PUBLIC_CDN_BASE_URL: z.string(),
});

const mergedParsedEnvSchema = parsedEnvSchema.merge(parsedClientEnvSchema);

export const parsedEnv = mergedParsedEnvSchema.parse(process.env);
export type ParsedEnv = z.infer<typeof mergedParsedEnvSchema>;

export function getMissingEnvVars(keys: (keyof ParsedEnv)[]): string[] {
  return keys.filter((key) => !parsedEnv[key] || parsedEnv[key].trim() === "") as string[];
}

export function assertEnvVars(keys: (keyof ParsedEnv)[], source: string): void {
  const missing = getMissingEnvVars(keys);
  if (missing.length > 0) {
    throw new Error(`[${source}] Missing required env vars: ${missing.join(", ")}. Fill frontend/.env.local`);
  }
}
