import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const ImportRowSchema = z.object({
  Название: z.string().min(1, "Название обязательно").max(255),
  Описание: z.string().optional().default(""),
  Статус: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  Приоритет: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  Проект: z.string().optional().default(""),
  Дедлайн: z.string().optional().default(""),
});
const batchId = crypto.randomUUID();
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Неверный токен" }, { status: 401 });
    }

    const body = await request.json();
    const rows = body.rows as Record<string, string>[];

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Нет данных для импорта" },
        { status: 400 },
      );
    }

    let created = 0;
    const errors: { row: number; error: string }[] = [];

    const projects = await prisma.project.findMany({
      where: { userId: payload.userId },
      select: { id: true, name: true },
    });

    for (let i = 0; i < rows.length; i++) {
      const result = ImportRowSchema.safeParse(rows[i]);

      if (!result.success) {
        errors.push({
          row: i + 2,
          error: result.error.issues.map((e) => e.message).join(", "),
        });
        continue;
      }
      const row = result.data;
      let deadline: Date | null = null;
      if (row.Дедлайн && row.Дедлайн.trim()) {
        const parsed = new Date(row.Дедлайн);
        if (!isNaN(parsed.getTime())) {
          deadline = parsed;
        }
      }
      const project = row.Проект
        ? projects.find(
            (p) => p.name.toLowerCase() === row.Проект.toLowerCase(),
          )
        : null;

      try {
        await prisma.task.create({
          data: {
            title: row.Название,
            description: row.Описание || null,
            status: row.Статус,
            priority: row.Приоритет,
            deadline,
            projectId: project?.id || null,
            userId: payload.userId,
            importBatchId: batchId,
          },
        });
        created++;
      } catch (err) {
        errors.push({
          row: i + 2,
          error: err instanceof Error ? err.message : "Неизвестная ошибка",
        });
      }
    }

    return NextResponse.json({ created, errors, batchId });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Ошибка импорта" }, { status: 500 });
  }
}
