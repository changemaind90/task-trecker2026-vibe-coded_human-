"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string | null;
};

type Props = {
  task: Task | null;
  onClose: () => void;
  onUpdated: (task: any) => void;
};

export default function EditTaskDialog({ task, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Заполняем поля при открытии
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  const saveEdit = async () => {
    if (!task) return;
    setIsSaving(true);

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } else {
      toast.error("Не удалось сохранить задачу");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            padding: "10px 0",
          }}
        >
          <Input
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-[10px] rounded-[6px] border border-[#ccc] resize-y min-h-[80px] font-[inherit] bg-transparent"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={saveEdit} disabled={isSaving}>
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
  );
}
