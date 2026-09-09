import { prisma } from "@/lib/prisma";
import { TaskDto } from "./task.dto";

export async function getTasksByUser(userId: string): Promise<TaskDto[]> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { project: true },
  });
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    projectName: task.project?.name,
  }));
}