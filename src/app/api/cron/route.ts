import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(request: Request) {
  // Защита: только Vercel Cron может вызывать
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await prisma.task.findMany({
    where: {
      deadline: { gte: now, lte: in24h },
      status: { not: "DONE" },
      user: { telegramChatId: { not: null } },
    },
    include: { user: { select: { telegramChatId: true } } },
  });

  for (const task of tasks) {
    if (task.user.telegramChatId) {
      await sendTelegramMessage(
        task.user.telegramChatId,
        `⏰ Напоминание: <b>${task.title}</b>\nДедлайн меньше чем через 24 часа!\n📅 ${new Date(task.deadline!).toLocaleString("ru-RU")}`,
      );
    }
  }

  return NextResponse.json({ sent: tasks.length });
}
