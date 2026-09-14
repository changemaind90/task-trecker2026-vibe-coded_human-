import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "TaskTracker2026 <onboarding@resend.dev>",
    to: [email],
    subject: "Подтвердите регистрацию в TaskFlow",
    html: `
      <h2>Добро пожаловать в TaskFlow!</h2>
      <p>Нажмите на кнопку ниже, чтобы подтвердить email:</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Подтвердить email</a>
      <p>Если вы не регистрировались — просто проигнорируйте это письмо.</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  return data;
}