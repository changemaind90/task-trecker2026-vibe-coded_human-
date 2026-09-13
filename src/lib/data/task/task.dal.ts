import { prisma } from "@/lib/prisma";
import { TaskDto } from "./task.dto";

export async function getTasksByUser(userId: string): Promise<TaskDto[]> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { project: true },
  });
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    deadline: task.deadline ? task.deadline.toISOString() : null,
    startedAt: task.startedAt ? task.startedAt.toISOString() : null,
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    projectId: task.projectId,
    project: task.project
      ? { id: task.project.id, name: task.project.name }
      : null,
  }));
}