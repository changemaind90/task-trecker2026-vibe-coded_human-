  "use client";

  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

  export type Task = {
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

  async function fetchTasks(): Promise<Task[]> {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Ошибка загрузки задач");
    return res.json();
  }

  async function createTask(data: Partial<Task>) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Ошибка создания");
    return res.json();
  }

  async function updateTask(id: string, data: Partial<Task>) {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Ошибка обновления");
    return res.json();
  }

  async function deleteTask(id: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Ошибка удаления");
    return res.json();
  }

  export function useTasks() {
    const queryClient = useQueryClient();

    // GET — список задач
    const tasksQuery = useQuery({
      queryKey: ["tasks"],
      queryFn: fetchTasks,
    });

    const createMutation = useMutation({
      mutationFn: createTask,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });


    // PUT — обновление задачи
    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
        updateTask(id, data),
      onSuccess: () => {
        // После успеха — перезапрашиваем список
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });

    // DELETE — удаление
    const deleteMutation = useMutation({
      mutationFn: deleteTask,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });

    return {
      tasks: tasksQuery.data ?? [],
      isLoading: tasksQuery.isLoading,
      error: tasksQuery.error,
      refetch: tasksQuery.refetch,
      updateTask: updateMutation.mutateAsync,
      deleteTask: deleteMutation.mutateAsync,
      createTask: createMutation.mutateAsync,
    };
  }