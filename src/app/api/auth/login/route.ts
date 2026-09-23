import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`login:${ip}`, { max: 5, windowMs: 60 * 1000 });

    if (!limit.success) {
      return NextResponse.json(
        { error: "Слишком много попыток входа. Попробуйте через минуту." },
        { status: 429 },
      );
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 },
      );
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
