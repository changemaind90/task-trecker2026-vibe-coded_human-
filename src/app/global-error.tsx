"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          textAlign: "center",
        }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>💥 Что-то пошло не так</h1>
          <p style={{ color: "#888", marginBottom: 24, maxWidth: 500 }}>
            Произошла непредвиденная ошибка. Мы уже знаем о ней и работаем над исправлением.
          </p>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>
            Код ошибки: {error.digest || "—"}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 24px",
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}