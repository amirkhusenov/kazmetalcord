"use server";
import { assertEnvVars, parsedEnv } from "@/lib/parsedEnv";
import { contactFormSchema } from '@/types';
import nodemailer from 'nodemailer';

export async function sendContactEmail(data: unknown): Promise<void> {
  const parsedData = contactFormSchema.parse(data);

  if (parsedData.extraInfo !== '') {
    console.log('Spam detected: honeypot field filled', parsedData.extraInfo);
    return;
  }

  assertEnvVars(["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_PORT"], "sendContactEmail");

  const transporter = nodemailer.createTransport({
    host: parsedEnv.SMTP_HOST,
    port: Number(parsedEnv.SMTP_PORT),
    auth: {
      user: parsedEnv.SMTP_USER,
      pass: parsedEnv.SMTP_PASS,
    },
    secure: true,
  });

  const submissionTime = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Almaty',
    hour12: false,
  });

  const htmlBody = `
    <h2>Новое сообщение с сайта</h2>
    <p><strong>Имя:</strong> ${parsedData.name}</p>
    <p><strong>Телефон:</strong> ${parsedData.phone}</p>
    <p style="margin-top: 20px; font-size: 12px; color: #888;"><em>Время отправки: ${submissionTime}</em></p>
    <p><strong>Товары:</strong></p>
    <ul>
      ${parsedData.items.map(item => `<li>${item["Наименование"]}</li>`).join('')}
    </ul>
  `;

  const textBody = `
Новое сообщение с сайта:

Имя: ${parsedData.name}
Телефон: ${parsedData.phone}
Товары: ${parsedData.items.map(item => item["Наименование"]).join(', ')}

Время отправки: ${submissionTime}
  `;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${parsedEnv.SMTP_USER}>`,
      to: parsedEnv.SMTP_USER,
      subject: `Сообщение с сайта`,
      html: htmlBody,
      text: textBody,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
