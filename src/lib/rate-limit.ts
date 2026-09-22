type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

export function rateLimit(
  identifier: string,
  { max, windowMs }: RateLimitOptions
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  // Если записи нет или окно истекло — создаём новую
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: max - 1, resetAt };
  }

  // Если лимит превышен — блокируем
  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Иначе — увеличиваем счётчик
  entry.count += 1;
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

// Периодическая очистка старых записей (раз в 5 минут)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}