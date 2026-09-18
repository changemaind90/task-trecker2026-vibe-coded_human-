
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, } from "@/components/ui/select";
import StatsPieChart from "@/components/StatsPieChart";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import TaskFilters from "@/components/TaskFilters";
import EditTaskDialog from "@/components/EditTaskDialog";

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
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch("/api/tasks", { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
    }).then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json(); })
      .then((data) => { if (data) { setTasks(data); } setLoading(false); })
      .catch((err) => {
        console.error("Ошибка загрузки задач:", err);
        setError(err.message);
        setLoading(false);
      });

    fetch("/api/projects",{headers: {Authorization: `Bearer ${token}`},})
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data))
      .catch(() => setProjects([]));
  }, [router]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus && filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterPriority && filterPriority !== "all" && task.priority !== filterPriority) return false;
      if (filterProject && filterProject !== "all" && task.projectId !== filterProject) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterProject, searchQuery]);

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
    <div style={{ width: "100%", padding: "20px 30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Мои задачи</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        <StatsPieChart todo={stats.todo} inProgress={stats.inProgress} done={stats.done} />
      </div>

      <Button style={{ marginBottom: 20 }} onClick={() => setIsCreateDialogOpen(true)}>
        ➕ Создать задачу
      </Button>

      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        projects={projects}
      />

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
                  </td>

                  <td style={tdStyle}>
                    <Select value={task.projectId || "none"}
                      onValueChange={async (value) => {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`/api/tasks/${task.id}`, {
                          method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                          body: JSON.stringify({ projectId: value === "none" ? null : value }),
                        });
                        if (res.ok) {
                          const updated = await res.json();
                          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }
                      }}>
                      <SelectTrigger className="w-[180px]">
                        <span>{task.projectId ? projects.find((p) => p.id === task.projectId)?.name || "—" : "Без проекта"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без проекта</SelectItem>
                        {projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td style={tdStyle}>
                    <Select value={task.status}
                      onValueChange={async (value) => {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`/api/tasks/${task.id}`, {
                          method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                          body: JSON.stringify({ status: value }),
                        });
                        if (res.ok) { const updated = await res.json();
                          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }
                      }}>
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
                  <td style={tdStyle}>
                    <Select value={task.priority}
                      onValueChange={async (value) => {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`/api/tasks/${task.id}`, {
                          method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                          body: JSON.stringify({ priority: value }),
                        });
                        if (res.ok) { const updated = await res.json(); setTasks((prev) => prev.map((t) =>
                           (t.id === updated.id ? updated : t))); }
                      }}>
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
                  <td style={tdStyle}>{new Date(task.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td style={tdStyle}>{task.startedAt ? new Date(task.startedAt).toLocaleDateString("ru-RU") : "—"}</td>
                  <td style={tdStyle}> {task.completedAt ? new Date(task.completedAt).toLocaleDateString("ru-RU") : "—"} </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>✏️</Button>
                      <Button variant="destructive" size="sm" onClick={async () => {
                          if (window.confirm("Удалить задачу?")) {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`/api/tasks/${task.id}`, {
                              method: "DELETE", headers: { Authorization: `Bearer ${token}` },
                            });
                            if (res.ok) { setTasks((prev) => prev.filter((t) => t.id !== task.id));}
                          }}}>🗑️</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        projects={projects}
        onCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
      />     

      <EditTaskDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdated={(updated) =>
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        }
      />
    </div>
  );
}