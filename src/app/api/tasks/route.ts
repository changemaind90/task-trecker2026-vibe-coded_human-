  // src/app/api/tasks/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";
  import { verifyToken } from "@/lib/auth";

  export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) { return NextResponse.json({ error: "Не авторизован" }, { status: 401 }); }

    const payload = verifyToken(token);
    if (!payload) { return NextResponse.json({ error: "Неверный токен" }, { status: 401 }); }
  
    const tasks = await prisma.task.findMany({
      where: { userId: payload.userId },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  }

  export async function POST(request: NextRequest) { 
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) { return NextResponse.json({ error: "Не авторизован" }, { status: 401 }); }

    const payload = verifyToken(token);
    if (!payload) { return NextResponse.json({ error: "Неверный токен" }, { status: 401 }); }
  
    const body = await request.json();
    const { title, description, status, priority, deadline, projectId } = body;
    if (!title) { return NextResponse.json({ error: "Название задачи обязательно" }, { status: 400 });}
  
      const now = new Date();
    const taskData: any = {
      title,
      description,
      status: status || "TODO",
      priority: priority || "MEDIUM",
      deadline: deadline ? new Date(deadline) : undefined,
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
  }
