"use client";

import { useState } from "react";
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
  const [isImporting, setIsImporting] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data);
        toast.success(`Загружено ${results.data.length} строк`);
      },
      error: (err) => {
        toast.error(`Ошибка парсинга: ${err.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (rows.length === 0) return;
    setIsImporting(true);

    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rows }),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(`Создано ${data.created} задач`);
      if (data.errors.length > 0) {
        toast.error(`Ошибок: ${data.errors.length}`);
        console.error("Import errors:", data.errors);
      }
      setRows([]);
      setFileName("");
      onImported();
      onOpenChange(false);
    } else {
      toast.error("Ошибка импорта");
    }

    setIsImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Импорт задач из CSV</DialogTitle>
        </DialogHeader>

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

          {fileName && (
            <p className="text-sm text-muted-foreground">
              📄 {fileName} — {rows.length} строк
            </p>
          )}

          {rows.length > 0 && (
            <div className="max-h-[200px] overflow-auto rounded-md border border-border p-2 text-xs">
              <pre>{JSON.stringify(rows.slice(0, 3), null, 2)}</pre>
              {rows.length > 3 && (
                <p className="text-muted-foreground mt-2">
                  ...и ещё {rows.length - 3} строк
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleImport}
            disabled={rows.length === 0 || isImporting}
          >
            {isImporting ? "Импорт..." : `Импортировать ${rows.length} задач`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
