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
import ConfirmDialog from "@/components/ConfirmDialog";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingProject, setEditingProject] = useState<{ id: string; name: string; description: string | null } | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      await createProject({ name: newName, description: newDesc });
      setNewName("");
      setNewDesc("");
    } catch (e) {
      // toast уже показан в хуке
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;
    setIsSaving(true);
    try {
      await updateProject({ id: editingProject.id, data: { name: editName, description: editDesc } });
      setEditingProject(null);
    } catch (e) { 
    } finally {
      setIsSaving(false);
    }
  }; 
  if (isLoading) return <div>Загрузка...</div>; 
  return (
    <div className="max-w-[800px] mx-auto p-5">
      <div className="flex justify-between mb-5">
        <h1>Проекты</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}> ← К задачам </Button>
      </div>

      <Card className="mb-5">
        <CardHeader> <CardTitle>Создать проект</CardTitle> </CardHeader>
        <CardContent className="flex flex-wrap gap-2.5">
          <Input placeholder="Название проекта" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="Описание" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Создание...
              </>
            ) : (
              "Добавить"
            )}
          </Button>
        </CardContent>
      </Card>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">Проектов пока нет</h3>
          <p className="text-muted-foreground max-w-md mb-6"> Создайте первый проект, чтобы группировать задачи </p>
        </div>
      ) : ( projects.map((project) => (
          <Card key={project.id} className="mb-2.5">
            <CardHeader> <CardTitle>{project.name}</CardTitle> </CardHeader>
            <CardContent>
              <p>{project.description || "Нет описания"}</p>
              <p className="text-xs text-muted-foreground mt-2.5">
                Задач: {"tasks" in project ? (project as any).tasks?.length ?? 0 : 0}
              </p>
              <div className="mt-2.5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingProject(project);
                    setEditName(project.name);
                    setEditDesc(project.description || "");
                  }}
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
        ))
      )}

      <Dialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-[15px] py-[10px]">
            <Input
              placeholder="Название"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              placeholder="Описание"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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