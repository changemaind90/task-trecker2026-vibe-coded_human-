import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { RegisterSchema } from "@/lib/schemas/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`register:${ip}`, { max: 3, windowMs: 60 * 60 * 1000 });

    if (!limit.success) {
      return NextResponse.json(
        { error: "Слишком много попыток регистрации. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Неверные данные",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    const telegramLink = `https://telegram.me/${botUsername}?start=${user.id}`;

    return NextResponse.json(
      {
        message: "Пользователь успешно создан. Подтвердите аккаунт в Telegram.",
        userId: user.id,
        telegramLink,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}