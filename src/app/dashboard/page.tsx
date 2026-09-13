
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
          projectId: newTaskProjectId === "none" ? null : newTaskProjectId,
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
      if (filterStatus && filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterPriority && filterPriority !== "all" && task.priority !== filterPriority) return false;
      if (filterProject && filterProject !== "all" && task.projectId !== filterProject) return false;
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
          <StatsPieChart todo={stats.todo} inProgress={stats.inProgress} done={stats.done} />
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
            <Select value={newTaskStatus} onValueChange={(value) => setNewTaskStatus(value ?? "TODO")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">TODO</SelectItem>
                <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                <SelectItem value="DONE">Готово</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value ?? "none")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">🟢 Низкий</SelectItem>
                <SelectItem value="MEDIUM">🟡 Средний</SelectItem>
                <SelectItem value="HIGH">🔴 Высокий</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newTaskProjectId} onValueChange={(value) => setNewTaskProjectId(value ?? "")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Без проекта" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без проекта</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Input placeholder="🔍 Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: 200 }}
            />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value ?? "")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="TODO">TODO</SelectItem>
                <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                <SelectItem value="DONE">Готово</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value ?? "")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Все приоритеты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все приоритеты</SelectItem>
                <SelectItem value="LOW">🟢 Низкий</SelectItem>
                <SelectItem value="MEDIUM">🟡 Средний</SelectItem>
                <SelectItem value="HIGH">🔴 Высокий</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProject} onValueChange={(value) => setFilterProject(value ?? "")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все проекты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все проекты</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline"
              onClick={() => { setFilterStatus(""); setFilterPriority(""); setFilterProject(""); setSearchQuery(""); }} >
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
                <tr className="bg-muted/50 text-left">
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
                      <Select
                        value={task.projectId || "none"}
                        onValueChange={async (value) => {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`/api/tasks/${task.id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ projectId: value === "none" ? null : value }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Без проекта</SelectItem>
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td style={tdStyle}>
                      <Select
                        value={task.status}
                        onValueChange={async (value) => {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`/api/tasks/${task.id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: value }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                          }
                        }}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TODO">TODO</SelectItem>
                          <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                          <SelectItem value="DONE">Готово</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td style={tdStyle}>
                     <Select
                        value={task.priority}
                        onValueChange={async (value) => {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`/api/tasks/${task.id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ priority: value }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                          }
                        }}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">🟢 Низкий</SelectItem>
                          <SelectItem value="MEDIUM">🟡 Средний</SelectItem>
                          <SelectItem value="HIGH">🔴 Высокий</SelectItem>
                        </SelectContent>
                      </Select>
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