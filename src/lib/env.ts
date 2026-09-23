import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// В CI переменных нет — подставляем заглушки, не валидируем
const isCI = process.env.CI === "true";

let envData: z.infer<typeof EnvSchema>;

if (isCI) {
  envData = {
    DATABASE_URL: "postgresql://ci:ci@ci:5432/ci",
    JWT_SECRET: "ci-secret-key-min-10-chars",
    NODE_ENV: "test",
  };
} else {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Ошибка в переменных окружения:", parsed.error.issues);
    throw new Error("Некорректные переменные окружения. Проверь .env");
  }
  envData = parsed.data;
}

export const env = envData;
