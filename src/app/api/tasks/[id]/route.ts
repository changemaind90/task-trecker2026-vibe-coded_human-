import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// PUT — обновить задачу
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { title, description, status, priority, deadline, projectId } = body;

    // Проверяем, что задача принадлежит пользователю
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask || existingTask.userId !== payload.userId) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
        priority,
        deadline: deadline ? new Date(deadline) : undefined,
        projectId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Ошибка обновления задачи" },
      { status: 500 }
    );
  }
}

// DELETE — удалить задачу
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask || existingTask.userId !== payload.userId) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Задача удалена" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Ошибка удаления задачи" },
      { status: 500 }
    );
  }
}