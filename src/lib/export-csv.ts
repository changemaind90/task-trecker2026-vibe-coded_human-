import Papa from "papaparse";
import type { Task } from "@/hooks/useTasks";

export function exportTasksToCsv(tasks: Task[], filename = "tasks.csv") {
  const rows = tasks.map((task) => ({
    Название: task.title,
    Описание: task.description || "",
    Статус: task.status,
    Приоритет: task.priority,
    Проект: task.project?.name || "Без проекта",
    Создана: new Date(task.createdAt).toLocaleString("ru-RU"),
    Начата: task.startedAt
      ? new Date(task.startedAt).toLocaleString("ru-RU")
      : "",
    Завершена: task.completedAt
      ? new Date(task.completedAt).toLocaleString("ru-RU")
      : "",
    Дедлайн: task.deadline
      ? new Date(task.deadline).toLocaleString("ru-RU")
      : "",
  }));

  const csv = Papa.unparse(rows, {
    quotes: true,
    delimiter: ",",
    header: true,
  });

  // BOM для правильной кодировки в Excel
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
