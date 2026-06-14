// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mongodb" }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()) : []),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      expiresIn: 900, // 15 minutes
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Jijenge <onboarding@resend.dev>",
          to: email,
          subject: "Your Swiftsoko verification code",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2 style="margin-bottom:8px">Verify your email</h2>
              <p>Use the code below to complete your sign-up. It expires in 15 minutes.</p>
              <div style="font-size:36px;font-weight:900;letter-spacing:12px;padding:20px;background:#eef2ff;border:2px solid #1e1b4b;text-align:center;margin:20px 0">
                ${otp}
              </div>
              <p style="color:#6b7280;font-size:12px">If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      },
      sendVerificationOnSignUp: true,
    }),
  ],
});
