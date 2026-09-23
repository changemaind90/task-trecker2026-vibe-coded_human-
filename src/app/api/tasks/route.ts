import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { CreateTaskSchema } from "@/lib/schemas/task";

export async function GET(request: NextRequest) {
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

    const tasks = await prisma.task.findMany({
      where: { userId: payload.userId },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("❌ GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки задач" },
      { status: 500 },
    );
  }
}

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
    const result = CreateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Неверные данные", details: result.error.issues },
        { status: 400 },
      );
    }

    const { title, description, status, priority, deadline, projectId } =
      result.data;

    const now = new Date();
    const taskData: any = {
      title,
      description,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : null,
      projectId: projectId || null,
      userId: payload.userId,
    };

    if (status === "IN_PROGRESS") {
      taskData.startedAt = now;
    }
    if (status === "DONE") {
      taskData.startedAt = now;
      taskData.completedAt = now;
    }

    const task = await prisma.task.create({
      data: taskData,
      include: { project: true },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Ошибка создания задачи" },
      { status: 500 },
    );
  }
}
