// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { TaskSchema } from "@/lib/schemas/task"; // создадим позже, пока закомментируем

export async function GET(request: NextRequest) {
  // 1. Проверяем токен (из заголовка Authorization)
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Неверный токен" }, { status: 401 });
  }

  // 2. Получаем задачи пользователя из БД
  const tasks = await prisma.task.findMany({
    where: { userId: payload.userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  // 1. Проверка токена (как выше)
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Неверный токен" }, { status: 401 });
  }

  // 2. Получаем данные из тела запроса
  const body = await request.json();

  // 3. Валидируем (пока упрощённо)
  const { title, description, status, priority, deadline, projectId } = body;

  if (!title) {
    return NextResponse.json({ error: "Название задачи обязательно" }, { status: 400 });
  }

  // 4. Создаём задачу
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "TODO",
      priority: priority || "MEDIUM",
      deadline: deadline ? new Date(deadline) : undefined,
      projectId,
      userId: payload.userId,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
