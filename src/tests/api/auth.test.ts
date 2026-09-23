import { describe, it, expect, vi } from "vitest";

// Мокаем verifyToken
vi.mock("@/lib/auth", () => ({
  verifyToken: vi.fn((token: string) => {
    if (token === "valid-token") return { userId: "user-1" };
    return null;
  }),
}));

describe("verifyToken", async () => {
  const { verifyToken } = await import("@/lib/auth");

  it("возвращает payload для валидного токена", () => {
    expect(verifyToken("valid-token")).toEqual({ userId: "user-1" });
  });

  it("возвращает null для невалидного токена", () => {
    expect(verifyToken("invalid")).toBeNull();
  });
});
