import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(255),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  deadline: z.string().datetime().optional(),
  projectId: z.string().optional(),
});

export type TaskInput = z.infer<typeof TaskSchema>;