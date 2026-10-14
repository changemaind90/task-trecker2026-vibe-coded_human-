"use client";

import { useState, useMemo } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type PreviewRow = {
  row: number;
  title: string;
  status: string;
  priority: string;
  project: string;
  deadline: string;
  warning: string;
};

type PreviewResult = {
  total: number;
  valid: number;
  errors: number;
  validRows: PreviewRow[];
  errorRows: any[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
};

export default function ImportTasksDialog({
  open,
  onOpenChange,
  onImported,
}: Props) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [isImporting, setIsImporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const reset = () => {
    setRows([]);
    setFileName("");
    setPreview(null);
    setStep("upload");
    setSelectedRows(new Set());
    setProjectFilter("all");
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        setRows(data);

        const token = localStorage.getItem("token");
        const res = await fetch("/api/tasks/import/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rows: data }),
        });

        if (res.ok) {
          const previewData: PreviewResult = await res.json();
          setPreview(previewData);
          setSelectedRows(new Set(previewData.validRows.map((r) => r.row)));
          setStep("preview");
        } else {
          toast.error("Ошибка валидации файла");
        }
      },
      error: (err) => toast.error(`Ошибка парсинга: ${err.message}`),
    });
  };

  // Уникальные проекты из валидных строк
  const uniqueProjects = useMemo(() => {
    if (!preview) return [];
    const set = new Set(preview.validRows.map((r) => r.project || "—"));
    return Array.from(set);
  }, [preview]);

  // Отфильтрованные строки
  const filteredRows = useMemo(() => {
    if (!preview) return [];
    if (projectFilter === "all") return preview.validRows;
    return preview.validRows.filter(
      (r) => (r.project || "—") === projectFilter,
    );
  }, [preview, projectFilter]);

  const toggleRow = (row: number) => {
    const next = new Set(selectedRows);
    if (next.has(row)) next.delete(row);
    else next.add(row);
    setSelectedRows(next);
  };

  const selectAll = () => {
    setSelectedRows(new Set(filteredRows.map((r) => r.row)));
  };

  const deselectAll = () => {
    setSelectedRows(new Set());
  };

  const handleImport = async () => {
    const rowsToImport = rows.filter((_, i) => selectedRows.has(i + 2));
    if (rowsToImport.length === 0) {
      toast.error("Не выбрано ни одной задачи");
      return;
    }

    setIsImporting(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rows: rowsToImport }),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(`Создано ${data.created} задач`);
      onImported();
      reset();
      onOpenChange(false);
    } else {
      toast.error("Ошибка импорта");
    }
    setIsImporting(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" ? "Импорт задач из CSV" : "Предпросмотр импорта"}
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="flex flex-col gap-4 py-2">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Экспортируйте задачи в CSV, отредактируйте в Excel и загрузите
              обратно.
            </p>
          </div>
        )}

        {step === "preview" && preview && (
          <div className="flex flex-col gap-4 py-2">
            {/* Статистика */}
            <div className="flex gap-4 text-sm flex-wrap">
              <div>
                📄 <b>{preview.total}</b> строк
              </div>
              <div className="text-green-500">
                ✅ Валидных: <b>{preview.valid}</b>
              </div>
              {preview.errors > 0 && (
                <div className="text-red-500">
                  ❌ Ошибок: <b>{preview.errors}</b>
                </div>
              )}
              <div className="text-[#6366f1]">
                ☑️ Выбрано: <b>{selectedRows.size}</b>
              </div>
            </div>

            {/* Ошибки */}
            {preview.errorRows.length > 0 && (
              <div className="max-h-[120px] overflow-auto rounded-md border border-red-500/30 p-3 bg-red-500/5">
                <p className="text-sm font-medium text-red-500 mb-2">
                  Строки с ошибками:
                </p>
                <ul className="space-y-1 text-xs">
                  {preview.errorRows.map((err) => (
                    <li key={err.row}>
                      <b>Строка {err.row}:</b> {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Фильтр по проекту */}
            {uniqueProjects.length > 1 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Проект:</label>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm cursor-pointer"
                >
                  <option value="all">Все ({preview.validRows.length})</option>
                  {uniqueProjects.map((p) => {
                    const count = preview.validRows.filter(
                      (r) => (r.project || "—") === p,
                    ).length;
                    return (
                      <option key={p} value={p}>
                        {p} ({count})
                      </option>
                    );
                  })}
                </select>

                <Button size="sm" variant="outline" onClick={selectAll}>
                  Выбрать все
                </Button>
                <Button size="sm" variant="outline" onClick={deselectAll}>
                  Снять все
                </Button>
              </div>
            )}

            {/* Список задач с чекбоксами */}
            {filteredRows.length > 0 && (
              <div className="max-h-[300px] overflow-auto rounded-md border border-border p-3">
                <ul className="space-y-2 text-sm">
                  {filteredRows.map((row) => (
                    <li
                      key={row.row}
                      className="flex items-start gap-3 p-2 rounded hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={selectedRows.has(row.row)}
                        onCheckedChange={() => toggleRow(row.row)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {row.title}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({row.status})
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex gap-3 mt-0.5">
                          {row.project && row.project !== "—" && (
                            <span>📁 {row.project}</span>
                          )}
                          {row.deadline && row.deadline !== "—" && (
                            <span>⏰ {row.deadline}</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {filteredRows.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет задач в выбранном проекте
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          {step === "upload" && <Button disabled>Импортировать</Button>}
          {step === "preview" && (
            <Button
              onClick={handleImport}
              disabled={isImporting || selectedRows.size === 0}
            >
              {isImporting
                ? "Импорт..."
                : `Импортировать ${selectedRows.size} задач`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
