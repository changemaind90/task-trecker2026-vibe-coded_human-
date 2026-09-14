import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// PUT — обновить проект
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { name, description } = await request.json();

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== payload.userId) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Ошибка обновления проекта" }, { status: 500 });
  }
}

// DELETE — удалить проект
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== payload.userId) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "Проект удалён" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Ошибка удаления проекта" }, { status: 500 });
  }
}