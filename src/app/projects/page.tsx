"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog";
import ProjectFormDialog from "@/components/ProjectFormDialog";
import { useProjects } from "@/hooks/useProjects";
import { motion } from "framer-motion";

type Project = { id: string; name: string; description: string | null };

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, isLoading, createProject, updateProject, deleteProject } =
    useProjects();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="max-w-[800px] mx-auto p-5">
      <div className="flex justify-between mb-5">
        <h1>Проекты</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          ← К задачам
        </Button>
      </div>

      <Button className="mb-5" onClick={() => setCreateOpen(true)}>
        ➕ Создать проект
      </Button>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">Проектов пока нет</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Создайте первый проект, чтобы группировать задачи
          </p>
        </div>
      ) : (
        projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="mb-2.5">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{project.description || "Нет описания"}</p>
                <div className="mt-2.5 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProject(project)}
                  >
                    ✏️ Редактировать
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteProjectId(project.id)}
                  >
                    🗑️ Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}

      {/* Создание */}
      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (data) => {
          await createProject({
            name: data.name,
            description: data.description,
          });
        }}
      />

      {/* Редактирование */}
      <ProjectFormDialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        project={editingProject}
        onSubmit={async (data) => {
          if (editingProject) {
            await updateProject({ id: editingProject.id, data });
          }
        }}
      />

      <ConfirmDialog
        open={!!deleteProjectId}
        onOpenChange={(open) => !open && setDeleteProjectId(null)}
        title="Удалить проект?"
        description="Задачи проекта останутся, но отвяжутся от него."
        onConfirm={async () => {
          if (deleteProjectId) {
            try {
              await deleteProject(deleteProjectId);
            } finally {
              setDeleteProjectId(null);
            }
          }
        }}
      />
    </div>
  );
}
