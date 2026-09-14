export type TaskDto = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  projectId: string | null;
  project: { id: string; name: string } | null;
};