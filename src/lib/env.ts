import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL обязателен"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET должен быть минимум 10 символов"),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Ошибка в переменных окружения:");
  console.error(parsed.error.issues);
  throw new Error("Некорректные переменные окружения. Проверь .env");
}

export const env = parsed.data;