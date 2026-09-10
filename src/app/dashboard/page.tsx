
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  project: { name: string } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("TODO");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return; // ← ВАЖНО: выходим из then, чтобы не пытаться парсить ошибку
          }
          // Для других ошибок — читаем текст
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json(); // ← Только если ответ успешный
      })
      .then((data) => {
        // Если data === undefined (потому что вышли по 401) — не обновляем
        if (data) { setTasks(data); } setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки задач:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const createTask = async () => {
    if (!newTaskTitle.trim()) return; setIsCreating(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTaskTitle, description: newTaskDesc, status: newTaskStatus,
        priority: newTaskPriority,
      }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskStatus("TODO");
      setNewTaskPriority("MEDIUM");
    }
    setIsCreating(false);
  };

  const saveEdit = async () => {
    if (!editingTask) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${editingTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, description: editDesc }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTask(null);
    } else {
      alert("Ошибка сохранения");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Мои задачи</h1>
        <Button variant="outline" onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}>
          Выйти
        </Button>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <CardHeader>
          <CardTitle>Создать новую задачу</CardTitle>
        </CardHeader>
        <CardContent style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Input
            placeholder="Название задачи"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Input
            placeholder="Описание"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="DONE">Готово</option>
          </select>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="LOW">🟢 Низкий</option>
            <option value="MEDIUM">🟡 Средний</option>
            <option value="HIGH">🔴 Высокий</option>
          </select>
          <Button onClick={createTask} disabled={isCreating}>
            {isCreating ? "Создание..." : "Добавить"}
          </Button>
        </CardContent>
      </Card>

      {tasks.length === 0 ? (
        <p>Задач пока нет</p>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} style={{ marginBottom: 10 }}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description || "Нет описания"}</p>
              <div style={{ display: "flex", gap: 15, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                {/* Статус */}
                <select
                  value={task.status}
                  onChange={async (e) => {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`/api/tasks/${task.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ status: e.target.value }),
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                    }
                  }}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">В работе</option>
                  <option value="DONE">Готово</option>
                </select>

                {/* ✅ Приоритет */}
                <select
                  value={task.priority}
                  onChange={async (e) => {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`/api/tasks/${task.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ priority: e.target.value }),
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                    }
                  }}
                >
                  <option value="LOW">🟢 Низкий</option>
                  <option value="MEDIUM">🟡 Средний</option>
                  <option value="HIGH">🔴 Высокий</option>
                </select>

                {task.project && <span>Проект: {task.project.name}</span>}
                {task.deadline && (
                  <span>Дедлайн: {new Date(task.deadline).toLocaleDateString()}</span>
                )}
              </div>

              <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingTask(task);
                    setEditTitle(task.title);
                    setEditDesc(task.description || "");
                  }}
                >
                  ✏️ Редактировать
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (window.confirm("Удалить задачу?")) {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`/api/tasks/${task.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (res.ok) {
                        setTasks((prev) => prev.filter((t) => t.id !== task.id));
                      } else {
                        alert("Ошибка удаления");
                      }
                    }
                  }}
                >
                  🗑️ Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать задачу</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 15, padding: "10px 0" }}>
            <Input
              placeholder="Название"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <Input
              placeholder="Описание"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Отмена
            </Button>
            <Button onClick={saveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}