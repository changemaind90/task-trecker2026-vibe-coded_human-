"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { exportTasksToCsv } from "@/lib/export-csv";
import type { Task } from "@/hooks/useTasks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
};

export default function ExportTasksDialog({
  open,
  onOpenChange,
  tasks,
}: Props) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(
    new Set(tasks.map((t) => t.id)),
  );
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Сбрасываем при открытии
  const handleOpenChange = (v: boolean) => {
    if (v) {
      setSelectedRows(new Set(tasks.map((t) => t.id)));
      setProjectFilter("all");
    }
    onOpenChange(v);
  };

  // Уникальные проекты
  const uniqueProjects = useMemo(() => {
    const set = new Set(tasks.map((t) => t.project?.name || "—"));
    return Array.from(set);
  }, [tasks]);

  // Отфильтрованные задачи
  const filteredTasks = useMemo(() => {
    if (projectFilter === "all") return tasks;
    return tasks.filter((t) => (t.project?.name || "—") === projectFilter);
  }, [tasks, projectFilter]);

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const selectAll = () => {
    setSelectedRows(new Set(filteredTasks.map((t) => t.id)));
  };

  const deselectAll = () => {
    setSelectedRows(new Set());
  };

  const handleExport = () => {
    const tasksToExport = tasks.filter((t) => selectedRows.has(t.id));
    if (tasksToExport.length === 0) {
      toast.error("Не выбрано ни одной задачи");
      return;
    }
    exportTasksToCsv(tasksToExport);
    toast.success(`Экспортировано ${tasksToExport.length} задач`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl  max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Экспорт задач в CSV</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 flex-1 overflow-hidden">
          {/* Статистика */}
          <div className="flex gap-4 text-sm flex-wrap">
            <div>
              📋 Всего: <b>{tasks.length}</b>
            </div>
            <div className="text-[#6366f1]">
              ☑️ Выбрано: <b>{selectedRows.size}</b>
            </div>
          </div>

          {/* Фильтр по проекту */}
          {uniqueProjects.length > 1 && (
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm font-medium">Проект:</label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm cursor-pointer"
              >
                <option value="all">Все ({tasks.length})</option>
                {uniqueProjects.map((p) => {
                  const count = tasks.filter(
                    (t) => (t.project?.name || "—") === p,
                  ).length;
                  return (
                    <option key={p} value={p}>
                      {p} ({count})
                    </option>
                  );
                })}
              </select>

              <Button size="sm" variant="outline" onClick={selectAll}>
                Выбрать все
              </Button>
              <Button size="sm" variant="outline" onClick={deselectAll}>
                Снять все
              </Button>
            </div>
          )}

          {/* Список задач с чекбоксами */}
          {filteredTasks.length > 0 ? (
            <div className="max-h-[400px] overflow-auto rounded-md border border-border p-3">
              <ul className="space-y-2 text-sm">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 p-2 rounded hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={selectedRows.has(task.id)}
                      onCheckedChange={() => toggleRow(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {task.title}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({task.status})
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-3 mt-0.5 flex-wrap">
                        {task.project && <span>📁 {task.project.name}</span>}
                        {task.deadline && (
                          <span>
                            ⏰ {new Date(task.deadline).toLocaleString("ru-RU")}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет задач в выбранном проекте
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleExport} disabled={selectedRows.size === 0}>
            📥 Экспортировать {selectedRows.size} задач
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
