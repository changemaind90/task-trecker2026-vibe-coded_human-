"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      // ✅ Успешная регистрация
      setSuccess(true);
      // ✅ Через 2 секунды редирект на логин
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Регистрация</h1>

      {success ? (
        <div style={{ color: "green", padding: 20, border: "1px solid green", borderRadius: 8 }}>
          <p>✅ Регистрация успешна!</p>
          <p>Перенаправление на страницу входа...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="Имя (необязательно)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль (минимум 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      <p>
        Уже есть аккаунт? <Link href="/login">Войти</Link>
      </p>
    </div>
  );
}