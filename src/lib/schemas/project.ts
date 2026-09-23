import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(255),
  description: z.string().optional().nullable(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();
