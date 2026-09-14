"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Проекты</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          ← К задачам
        </Button>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <CardHeader>
          <CardTitle>Создать проект</CardTitle>
        </CardHeader>
        <CardContent style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Input
            placeholder="Название проекта"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Описание"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <Button onClick={createProject} disabled={isCreating}>
            {isCreating ? "Создание..." : "Добавить"}
          </Button>
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
              <p style={{ fontSize: 12, color: "#888", marginTop: 10 }}>
                Задач: {project.tasks.length} • Создан:{" "}
                {new Date(project.createdAt).toLocaleDateString("ru-RU")}
              </p>
              <div style={{ marginTop: 10 }}>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (!window.confirm("Удалить проект?")) return;
                    const token = localStorage.getItem("token");
                    const res = await fetch(`/api/projects/${project.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                      setProjects((prev) => prev.filter((p) => p.id !== project.id));
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
    </div>
  );
}