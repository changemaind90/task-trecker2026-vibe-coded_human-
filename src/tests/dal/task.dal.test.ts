import { describe, it, expect } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma";
import { getTasksByUser } from "@/lib/data/task/task.dal";

describe("getTasksByUser", () => {
  it("возвращает задачи пользователя в формате DTO", async () => {
    prismaMock.task.findMany.mockResolvedValue([
      {
        id: "task-1",
        title: "Тестовая задача",
        description: "Описание",
        status: "TODO",
        priority: "HIGH",
        deadline: null,
        startedAt: null,
        completedAt: null,
        createdAt: new Date("2026-09-16"),
        updatedAt: new Date("2026-09-16"),
        projectId: null,
        userId: "user-1",
        project: null,
      },
    ] as any);

    const result = await getTasksByUser("user-1");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Тестовая задача");
    expect(result[0].status).toBe("TODO");
    expect(result[0].priority).toBe("HIGH");
    expect(result[0].createdAt).toBe("2026-09-16T00:00:00.000Z");
  });

  it("возвращает пустой массив, если задач нет", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);
    const result = await getTasksByUser("user-1");
    expect(result).toEqual([]);
  });
});
