import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.email("Некорректный email"),
  password: z
    .string()
    .min(8, "Пароль минимум 8 символов")
    .refine(
      (val) => val.trim().length > 0,
      "Пароль не может состоять только из пробелов",
    )
    .refine(
      (val) => /[a-zA-Zа-яА-Я]/.test(val),
      "Пароль должен содержать букву",
    )
    .refine((val) => /\d/.test(val), "Пароль должен содержать цифру"),
  name: z.string().optional().nullable(),
});

export const LoginSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});
