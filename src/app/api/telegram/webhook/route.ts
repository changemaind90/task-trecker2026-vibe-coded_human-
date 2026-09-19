
  import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();

      if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        if (text.startsWith("/start")) {
          const userId = text.split(" ")[1];

          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                telegramChatId: chatId.toString(),
                emailVerified: true,
              },
            });

            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: "✅ Ваш аккаунт успешно подтвержден! Вернитесь на сайт и войдите.",
              }),
            });
          } 
        }
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Telegram webhook error:", error);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }