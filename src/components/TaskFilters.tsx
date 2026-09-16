"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type Project = { id: string; name: string };

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterPriority: string;
  setFilterPriority: (v: string) => void;
  filterProject: string;
  setFilterProject: (v: string) => void;
  projects: Project[];
};

export default function TaskFilters({
  searchQuery, setSearchQuery,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
  filterProject, setFilterProject,
  projects,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
      <Input
        placeholder="🔍 Поиск по названию"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ minWidth: 200 }}
      />

      <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "")}>
        <SelectTrigger className="w-[160px]">
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

      <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? "")}>
        <SelectTrigger className="w-[170px]">
          <span>
            {(!filterPriority || filterPriority === "all") && "Все приоритеты"}
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

      <Select value={filterProject} onValueChange={(v) => setFilterProject(v ?? "")}>
        <SelectTrigger className="w-[180px]">
          <span>
            {(!filterProject || filterProject === "all")
              ? "Все проекты"
              : projects.find((p) => p.id === filterProject)?.name || "—"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все проекты</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

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
    </div>
  );
}