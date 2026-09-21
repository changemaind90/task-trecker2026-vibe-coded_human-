"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-5 text-center">
      <h1 className="text-2xl font-bold">⚠️ Не удалось загрузить задачи</h1>
      <p className="text-muted-foreground">
        Возможно, проблема с подключением к серверу.
      </p>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
}