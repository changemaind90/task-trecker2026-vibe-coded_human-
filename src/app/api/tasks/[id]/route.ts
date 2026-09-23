import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { UpdateTaskSchema } from "@/lib/schemas/task";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
    const result = UpdateTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Неверные данные", details: result.error.issues },
        { status: 400 },
      );
    }

    const { title, description, status, priority, deadline, projectId } =
      result.data;
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== payload.userId) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (deadline !== undefined)
      updateData.deadline = deadline ? new Date(deadline) : null;
    if (projectId !== undefined) updateData.projectId = projectId || null;

    if (status !== undefined) {
      updateData.status = status;
      if (status === "IN_PROGRESS" && !existingTask.startedAt) {
        updateData.startedAt = new Date();
      }
      if (status === "DONE") {
        updateData.completedAt = new Date();
        if (!existingTask.startedAt) {
          updateData.startedAt = new Date();
        }
      }
      if (status !== "DONE" && existingTask.completedAt) {
        updateData.completedAt = null;
      }
    }
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: { project: true },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Ошибка обновления задачи" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Неверный токен" }, { status: 401 });
    }
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== payload.userId) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Задача удалена" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Ошибка удаления задачи" },
      { status: 500 },
    );
  }
}
