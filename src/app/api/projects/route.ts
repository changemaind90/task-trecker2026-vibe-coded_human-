import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { CreateProjectSchema } from "@/lib/schemas/project";

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
    const projects = await prisma.project.findMany({
      where: { userId: payload.userId },
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки проектов" },
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
    const result = CreateProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Неверные данные", details: result.error.issues },
        { status: 400 },
      );
    }

    const { name, description } = result.data;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: payload.userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Ошибка создания проекта" },
      { status: 500 },
    );
  }
}
