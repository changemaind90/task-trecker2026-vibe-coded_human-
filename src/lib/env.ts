import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

let cached: z.infer<typeof EnvSchema> | null = null;

export function getEnv() {
  if (cached) return cached;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Ошибка в переменных окружения:", parsed.error.issues);
    throw new Error("Некорректные переменные окружения");
  }

  cached = parsed.data;
  return cached;
}

export const env = new Proxy({} as z.infer<typeof EnvSchema>, {
  get(_, key: string) {
    return getEnv()[key as keyof z.infer<typeof EnvSchema>];
  },
});