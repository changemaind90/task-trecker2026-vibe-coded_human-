"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логируем ошибку (позже сюда можно подключить Sentry)
    console.error("Ошибка на странице:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-5 text-center">
      <h1 className="text-3xl font-bold">😔 Что-то сломалось</h1>
      <p className="text-muted-foreground max-w-md">
        Не удалось загрузить страницу. Возможно, проблема временная.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Код ошибки: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button onClick={reset}>Попробовать снова</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          На главную
        </Button>
      </div>
    </div>
  );
}
