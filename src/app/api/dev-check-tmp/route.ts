import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function signCookieValue(value: string, secret: string): string {
  const signature = crypto.createHmac("sha256", secret).update(value).digest("base64");
  return encodeURIComponent(`${value}.${signature}`);
}

export async function GET() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, emailVerified: true, role: true } });
  const accounts = await prisma.account.findMany({ select: { id: true, userId: true, providerId: true } });
  return NextResponse.json({ users, accounts });
}

export async function POST(request: Request) {
  const { userId } = await request.json();
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      token,
      userId,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    },
  });

  const signed = signCookieValue(token, process.env.BETTER_AUTH_SECRET!);
  return NextResponse.json({ cookie: `better-auth.session_token=${signed}` });
}
