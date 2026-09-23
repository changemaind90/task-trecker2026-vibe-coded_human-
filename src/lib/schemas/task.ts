import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .max(255, "Максимум 255 символов"),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  deadline: z.iso.datetime().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();
