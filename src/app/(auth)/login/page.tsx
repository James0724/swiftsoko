import { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Swiftsoko",
  description:
    "Securely access your Swiftsoko account to manage orders and checkout.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-50/50 p-6">
      {/* 2. Background Decorative Element (Subtle Gradient) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%_#fff_40%,#63e_100%)] opacity-20" />

      {/* 3. The Auth Form Card */}
      <div className="w-full max-w-md">
        <AuthForm />
      </div>

      {/* 4. Footer Links */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2026 SwiftSoko. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/terms" className="hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
