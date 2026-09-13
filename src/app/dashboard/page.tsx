
  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import ThemeToggle from "@/components/ThemeToggle";
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
  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatsPieChart from "@/components/StatsPieChart";

  type Task = {
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
    const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
    const [newTaskProjectId, setNewTaskProjectId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterProject, setFilterProject] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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

      fetch("/api/projects", { // загрузка проектов
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setProjects(data))
        .catch(() => setProjects([]));
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
          title: newTaskTitle,
          description: newTaskDesc,
          status: newTaskStatus,
          priority: newTaskPriority,
          projectId: newTaskProjectId || null,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev) => [newTask, ...prev]);
        setNewTaskTitle("");
        setNewTaskDesc("");
        setNewTaskStatus("TODO");
        setNewTaskPriority("LOW");
        setNewTaskProjectId("");
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

    const filteredTasks = tasks.filter((task) => {
      if (filterStatus && task.status !== filterStatus) return false;
      if (filterPriority && task.priority !== filterPriority) return false;
      if (filterProject && task.projectId !== filterProject) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "TODO").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: tasks.filter((t) => t.status === "DONE").length,
      highPriority: tasks.filter((t) => t.priority === "HIGH" && t.status !== "DONE").length,
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

    const thStyle: React.CSSProperties = {
      padding: "10px 12px",
      borderBottom: "2px solid #ddd",
      fontWeight: 600,
    };

    const tdStyle: React.CSSProperties = {
      padding: "10px 12px",
      verticalAlign: "top",
    };

    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" onClick={() => router.push("/projects")}>
              📁 Проекты
            </Button>
            <ThemeToggle />
          </div>
          <h1>Мои задачи</h1>
          <Button variant="outline" onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}>
            Выйти
          </Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
          <Card>
            <CardContent style={{ padding: 15, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.total}</div>
              <div style={{ fontSize: 12, color: "#666" }}>Всего задач</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: 15, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#888" }}>{stats.todo}</div>
              <div style={{ fontSize: 12, color: "#666" }}>TODO</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: 15, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b" }}>{stats.inProgress}</div>
              <div style={{ fontSize: 12, color: "#666" }}>В работе</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: 15, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981" }}>{stats.done}</div>
              <div style={{ fontSize: 12, color: "#666" }}>Готово</div>
            </CardContent>
          </Card>
          <Card>
            {/* <CardContent style={{ padding: 15, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>{stats.highPriority}</div>
              <div style={{ fontSize: 12, color: "#666" }}>🔥 Срочных</div>
            </CardContent> */}
            <StatsPieChart todo={stats.todo} inProgress={stats.inProgress} done={stats.done} />
          </Card>
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
            <select
              value={newTaskProjectId}
              onChange={(e) => setNewTaskProjectId(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            >
              <option value="">Без проекта</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Button onClick={createTask} disabled={isCreating}>
              {isCreating ? "Создание..." : "Добавить"}
            </Button>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Input
              placeholder="🔍 Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: 200 }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            >
              <option value="">Все статусы</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">В работе</option>
              <option value="DONE">Готово</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            >
              <option value="">Все приоритеты</option>
              <option value="LOW">🟢 Низкий</option>
              <option value="MEDIUM">🟡 Средний</option>
              <option value="HIGH">🔴 Высокий</option>
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            >
              <option value="">Все проекты</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setFilterStatus("");
                setFilterPriority("");
                setFilterProject("");
                setSearchQuery("");
              }}
            >
              Сбросить
            </Button>
          </CardContent>
        </Card>

        {filteredTasks.length === 0 ? (
          <p>{tasks.length === 0 ? "Задач пока нет" : "Ничего не найдено по фильтрам"}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                  <th style={thStyle}>Название</th>
                  <th style={thStyle}>Проект</th>
                  <th style={thStyle}>Статус</th>
                  <th style={thStyle}>Приоритет</th>
                  <th style={thStyle}>Создана</th>
                  <th style={thStyle}>Начата</th>
                  <th style={thStyle}>Завершена</th>
                  <th style={thStyle}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      {task.description && (
                        <div style={{ fontSize: 12, color: "#888" }}>{task.description}</div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <select
                        value={task.projectId || ""}
                        onChange={async (e) => {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`/api/tasks/${task.id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ projectId: e.target.value || null }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                          }
                        }}
                        style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                      >
                        <option value="">Без проекта</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td style={tdStyle}>
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
                    </td>
                    <td style={tdStyle}>
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
                    </td>
                    <td style={tdStyle}>{new Date(task.createdAt).toLocaleDateString("ru-RU")}</td>
                    <td style={tdStyle}>
                      {task.startedAt ? new Date(task.startedAt).toLocaleDateString("ru-RU") : "—"}
                    </td>
                    <td style={tdStyle}>
                      {task.completedAt ? new Date(task.completedAt).toLocaleDateString("ru-RU") : "—"}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTask(task);
                            setEditTitle(task.title);
                            setEditDesc(task.description || "");
                          }}
                        >
                          ✏️
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
                              }
                            }
                          }}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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