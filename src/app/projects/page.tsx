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

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  tasks: { id: string }[];
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const createProject = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);

    const token = localStorage.getItem("token");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });

    if (res.ok) {
      const project = await res.json();
      setProjects((prev) => [{ ...project, tasks: [] }, ...prev]);
      setNewName("");
      setNewDesc("");
    }
    setIsCreating(false);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="max-w-[800px] mx-auto p-5">
      <div className="flex justify-between mb-5">
        <h1>Проекты</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          ← К задачам
        </Button>
      </div>

      <Card className="mb-5">
        <CardHeader> <CardTitle>Создать проект</CardTitle> </CardHeader>
        <CardContent className="flex flex-wrap gap-2.5">
          <Input placeholder="Название проекта" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="Описание" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Button onClick={createProject} disabled={isCreating}> {isCreating ? "Создание..." : "Добавить"} </Button>
        </CardContent>
      </Card>


      

      {projects.length === 0 ? (
        <p>Проектов пока нет</p>
      ) : (
        projects.map((project) => (
          <Card key={project.id} style={{ marginBottom: 10 }}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description || "Нет описания"}</p>
              <p className="text-[12px] text-[#888] mt-2.5">
                Задач: {project.tasks.length} • Создан:{" "}
                {new Date(project.createdAt).toLocaleDateString("ru-RU")}
              </p>
              <div className="mt-2.5">

                <Button variant="outline" size="sm"
                  onClick={() => {
                    setEditingProject(project);
                    setEditName(project.name);
                    setEditDesc(project.description || "");
                  }}
                  className="mr-2"
                > ✏️ Редактировать
                </Button>

                <Button variant="destructive" size="sm"
                  onClick={async () => {
                    if (!window.confirm("Удалить проект?")) return;
                    const token = localStorage.getItem("token");
                    const res = await fetch(`/api/projects/${project.id}`, {
                      method: "DELETE", headers: { Authorization: `Bearer ${token}` }, });
                    if (res.ok) { setProjects((prev) => prev.filter((p) => p.id !== project.id)); }
                  }}
                >
                  🗑️ Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-[15px] py-[10px]">
            <Input placeholder="Название" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <Input placeholder="Описание" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}> Отмена </Button>
            <Button onClick={async () => {
                if (!editingProject) return;
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/projects/${editingProject.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                  body: JSON.stringify({ name: editName, description: editDesc }),
                });
                if (res.ok) {
                  const updated = await res.json();
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === updated.id ? { ...updated, tasks: p.tasks } : p
                    )
                  );
                  setEditingProject(null);
                }
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}