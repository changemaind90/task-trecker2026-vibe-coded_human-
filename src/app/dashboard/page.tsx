"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import StatsPieChart from "@/components/StatsPieChart";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import EditTaskDialog from "@/components/EditTaskDialog";
import { useTasks, type Task } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import ConfirmDialog from "@/components/ConfirmDialog";
import { motion } from "framer-motion";
import FilterDialog from "@/components/FilterDialog";

export default function DashboardPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const { projects } = useProjects();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    tasks,
    isLoading: loading,
    error,
    updateTask,
    deleteTask,
    createTask,
    refetch,
  } = useTasks();
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        filterStatus &&
        filterStatus !== "all" &&
        task.status !== filterStatus
      )
        return false;
      if (
        filterPriority &&
        filterPriority !== "all" &&
        task.priority !== filterPriority
      )
        return false;
      if (
        filterProject &&
        filterProject !== "all" &&
        task.projectId !== filterProject
      )
        return false;
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterProject, searchQuery]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
    highPriority: tasks.filter(
      (t) => t.priority === "HIGH" && t.status !== "DONE",
    ).length,
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red">Ошибка: {error.message}</div>;

  return (
    <div className="w-full px-8 py-5">
      <StatsPieChart
        todo={stats.todo}
        inProgress={stats.inProgress}
        done={stats.done}
      />
      <div className="flex gap-3 justify-center mb-5 flex-wrap">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          ➕ Создать задачу
        </Button>
        <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
          🔍 Фильтры
          {(filterStatus && filterStatus !== "all") ||
          (filterPriority && filterPriority !== "all") ||
          (filterProject && filterProject !== "all") ||
          searchQuery
            ? " •"
            : ""}
        </Button>
      </div>
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">
            {tasks.length === 0 ? "📋" : "🔍"}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {tasks.length === 0 ? "Пока задач нет" : "Ничего не найдено"}
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {tasks.length === 0
              ? "Создайте первую задачу, чтобы начать работу"
              : "Попробуйте изменить фильтры или поисковый запрос"}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              ➕ Создать первую задачу
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Название
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Проект
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Статус
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Приоритет
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Создана
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Начата
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Завершена
                </th>
                <th className="px-3 py-2.5 border-b-2 border-border font-semibold text-left">
                  Действия
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-b border-border"
                >
                  <td className="px-3 py-2.5 align-top">
                    <div className="font-medium">{task.title}</div>
                  </td>

                  <td className="px-3 py-2.5 align-top">
                    <Select
                      value={task.projectId || "none"}
                      onValueChange={(value) =>
                        updateTask({
                          id: task.id,
                          data: { projectId: value === "none" ? null : value },
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <span>
                          {task.projectId
                            ? projects.find((p) => p.id === task.projectId)
                                ?.name || "—"
                            : "Без проекта"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без проекта</SelectItem>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        updateTask({
                          id: task.id,
                          data: { status: value ?? "TODO" },
                        })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <span>
                          {task.status === "TODO" && "📋 Не назначена"}
                          {task.status === "IN_PROGRESS" && "⚙️ В работе"}
                          {task.status === "DONE" && "✅ Готово"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODO">Не назначена</SelectItem>
                        <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                        <SelectItem value="DONE">Готово</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <Select
                      value={task.priority}
                      onValueChange={(value) =>
                        updateTask({
                          id: task.id,
                          data: { priority: value ?? "MEDIUM" },
                        })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <span>
                          {task.priority === "LOW" && "🟢 Низкий"}
                          {task.priority === "MEDIUM" && "🟡 Средний"}
                          {task.priority === "HIGH" && "🔴 Высокий"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">🟢 Низкий</SelectItem>
                        <SelectItem value="MEDIUM">🟡 Средний</SelectItem>
                        <SelectItem value="HIGH">🔴 Высокий</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    {new Date(task.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    {task.startedAt
                      ? new Date(task.startedAt).toLocaleDateString("ru-RU")
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    {" "}
                    {task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString("ru-RU")
                      : "—"}{" "}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTask(task)}
                      >
                        ✏️ Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTaskId(task.id)}
                      >
                        🗑️ Удалить
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        projects={projects}
        onReset={() => {
          setFilterStatus("");
          setFilterPriority("");
          setFilterProject("");
          setSearchQuery("");
        }}
      />
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        projects={projects}
        onCreated={() => refetch()}
      />
      <EditTaskDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdated={() => refetch()}
      />
      <ConfirmDialog
        open={!!deleteTaskId}
        onOpenChange={(open) => !open && setDeleteTaskId(null)}
        title="Удалить задачу?"
        description="Это действие нельзя отменить. Задача будет удалена навсегда."
        onConfirm={() => {
          if (deleteTaskId) {
            deleteTask(deleteTaskId);
            setDeleteTaskId(null);
          }
        }}
      />
    </div>
  );
}
