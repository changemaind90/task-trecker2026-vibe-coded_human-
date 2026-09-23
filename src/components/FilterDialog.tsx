"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterPriority: string;
  setFilterPriority: (v: string) => void;
  filterProject: string;
  setFilterProject: (v: string) => void;
  projects: Project[];
  onReset: () => void;
};

export default function FilterDialog({
  open,
  onOpenChange,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterProject,
  setFilterProject,
  projects,
  onReset,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Фильтры и поиск</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <Input
            placeholder="🔍 Поиск по названию"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v ?? "")}
          >
            <SelectTrigger>
              <span>
                {(!filterStatus || filterStatus === "all") && "Все статусы"}
                {filterStatus === "TODO" && "📋 Не назначена"}
                {filterStatus === "IN_PROGRESS" && "⚙️ В работе"}
                {filterStatus === "DONE" && "✅ Готово"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="TODO">📋 Не назначена</SelectItem>
              <SelectItem value="IN_PROGRESS">⚙️ В работе</SelectItem>
              <SelectItem value="DONE">✅ Готово</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterPriority}
            onValueChange={(v) => setFilterPriority(v ?? "")}
          >
            <SelectTrigger>
              <span>
                {(!filterPriority || filterPriority === "all") &&
                  "Все приоритеты"}
                {filterPriority === "LOW" && "🟢 Низкий"}
                {filterPriority === "MEDIUM" && "🟡 Средний"}
                {filterPriority === "HIGH" && "🔴 Высокий"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="LOW">🟢 Низкий</SelectItem>
              <SelectItem value="MEDIUM">🟡 Средний</SelectItem>
              <SelectItem value="HIGH">🔴 Высокий</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterProject}
            onValueChange={(v) => setFilterProject(v ?? "")}
          >
            <SelectTrigger>
              <span>
                {!filterProject || filterProject === "all"
                  ? "Все проекты"
                  : projects.find((p) => p.id === filterProject)?.name || "—"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все проекты</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onReset();
              onOpenChange(false);
            }}
          >
            Сбросить
          </Button>
          <Button onClick={() => onOpenChange(false)}>Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
