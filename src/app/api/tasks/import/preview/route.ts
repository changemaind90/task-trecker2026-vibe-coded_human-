import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const ImportRowSchema = z.object({
  Название: z.string().min(1, "Название обязательно").max(255),
  Описание: z.string().optional().default(""),
  Статус: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  Приоритет: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  Проект: z.string().optional().default(""),
  Дедлайн: z.string().optional().default(""),
});

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
      return NextResponse.json({ error: "Нет данных" }, { status: 400 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: payload.userId },
      select: { name: true },
    });
    const projectNames = projects.map((p) => p.name.toLowerCase());

    const valid: any[] = [];
    const errors: { row: number; message: string; data: any }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const result = ImportRowSchema.safeParse(rows[i]);

      if (!result.success) {
        errors.push({
          row: i + 2,
          message: result.error.issues.map((e) => e.message).join(", "),
          data: rows[i],
        });
        continue;
      }

      const row = result.data;

      // Проверяем дедлайн
      let deadlineValid = true;
      if (row.Дедлайн && row.Дедлайн.trim()) {
        const parsed = new Date(row.Дедлайн);
        if (isNaN(parsed.getTime())) {
          errors.push({
            row: i + 2,
            message: `Неверный формат даты: "${row.Дедлайн}"`,
            data: rows[i],
          });
          continue;
        }
      }

      // Проверяем проект
      let projectWarning = "";
      if (row.Проект && !projectNames.includes(row.Проект.toLowerCase())) {
        projectWarning = `Проект "${row.Проект}" не найден — задача будет без проекта`;
      }

      valid.push({
        row: i + 2,
        title: row.Название,
        status: row.Статус,
        priority: row.Приоритет,
        project: row.Проект || "—",
        deadline: row.Дедлайн || "—",
        warning: projectWarning,
      });
    }

    return NextResponse.json({
      total: rows.length,
      valid: valid.length,
      errors: errors.length,
      validRows: valid,
      errorRows: errors,
    });
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json({ error: "Ошибка валидации" }, { status: 500 });
  }
}
