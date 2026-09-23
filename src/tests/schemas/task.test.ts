import { describe, it, expect } from "vitest";
import { z } from "zod";

// Та же схема, что используется в API
const TaskSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(255),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  deadline: z.string().datetime().optional(),
  projectId: z.string().optional(),
});

describe("TaskSchema", () => {
  it("принимает валидную задачу с минимальными полями", () => {
    const result = TaskSchema.safeParse({ title: "Купить хлеб" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("TODO");
      expect(result.data.priority).toBe("MEDIUM");
    }
  });

  it("принимает задачу со всеми полями", () => {
    const result = TaskSchema.safeParse({
      title: "Срочная задача",
      description: "Описание",
      status: "IN_PROGRESS",
      priority: "HIGH",
      deadline: "2026-12-31T23:59:59.000Z",
      projectId: "proj-1",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("IN_PROGRESS");
      expect(result.data.priority).toBe("HIGH");
    }
  });

  it("отклоняет пустое название", () => {
    const result = TaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("отклоняет слишком длинное название (>255)", () => {
    const result = TaskSchema.safeParse({ title: "a".repeat(256) });
    expect(result.success).toBe(false);
  });

  it("отклоняет неверный статус", () => {
    const result = TaskSchema.safeParse({ title: "Test", status: "WRONG" });
    expect(result.success).toBe(false);
  });

  it("отклоняет неверный приоритет", () => {
    const result = TaskSchema.safeParse({ title: "Test", priority: "URGENT" });
    expect(result.success).toBe(false);
  });

  it("отклоняет невалидный формат даты", () => {
    const result = TaskSchema.safeParse({ title: "Test", deadline: "не-дата" });
    expect(result.success).toBe(false);
  });

  it("отклоняет задачу без title", () => {
    const result = TaskSchema.safeParse({ description: "Только описание" });
    expect(result.success).toBe(false);
  });
});
