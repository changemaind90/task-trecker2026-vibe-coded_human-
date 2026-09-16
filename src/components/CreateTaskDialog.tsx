"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/select";

type Project = { id: string; name: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  onCreated: (task: any) => void;
};

export default function CreateTaskDialog({ open, onOpenChange, projects, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [projectId, setProjectId] = useState("none");
  const [isCreating, setIsCreating] = useState(false);

  const createTask = async () => {
    if (!title.trim()) return;
    setIsCreating(true);

    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        projectId: projectId === "none" ? null : projectId,
      }),
    });

    if (res.ok) {
      const newTask = await res.json();
      onCreated(newTask);
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setProjectId("none");
      onOpenChange(false);
    }
    setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую задачу</DialogTitle>
        </DialogHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "10px 0" }}>
          <Input
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Select value={status} onValueChange={(v) => setStatus(v ?? "TODO")}>
              <SelectTrigger className="w-[160px]">
                <span>
                  {status === "TODO" && "📋 Не назначена"}
                  {status === "IN_PROGRESS" && "⚙️ В работе"}
                  {status === "DONE" && "✅ Готово"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">📋 Не назначена</SelectItem>
                <SelectItem value="IN_PROGRESS">⚙️ В работе</SelectItem>
                <SelectItem value="DONE">✅ Готово</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={(v) => setPriority(v ?? "MEDIUM")}>
              <SelectTrigger className="w-[140px]">
                <span>
                  {priority === "LOW" && "🟢 Низкий"}
                  {priority === "MEDIUM" && "🟡 Средний"}
                  {priority === "HIGH" && "🔴 Высокий"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">🟢 Низкий</SelectItem>
                <SelectItem value="MEDIUM">🟡 Средний</SelectItem>
                <SelectItem value="HIGH">🔴 Высокий</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectId} onValueChange={(v) => setProjectId(v ?? "none")}>
              <SelectTrigger className="w-[180px]">
                <span>
                  {projectId === "none"
                    ? "Без проекта"
                    : projects.find((p) => p.id === projectId)?.name || "—"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без проекта</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              resize: "vertical",
              minHeight: 80,
              fontFamily: "inherit",
              background: "transparent",
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={createTask} disabled={isCreating}>
            {isCreating ? "Создание..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}