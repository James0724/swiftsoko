"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    email: z.string().email("Valid email required"),
    firstName: z.string().min(2, "At least 2 characters"),
    lastName: z.string().min(2, "At least 2 characters"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function getAuthError(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";
  const code = (error.code ?? "").toUpperCase();
  const msg = (error.message ?? "").toLowerCase();

  if (code === "INVALID_EMAIL_OR_PASSWORD" || msg.includes("invalid email or password"))
    return "Incorrect email or password. Please try again.";
  if (code === "EMAIL_NOT_VERIFIED" || msg.includes("not verified"))
    return "Your email is not verified yet.";
  if (code === "USER_ALREADY_EXISTS" || msg.includes("already exists"))
    return "An account with this email already exists. Try logging in.";
  if (code === "RATE_LIMIT_EXCEEDED" || msg.includes("rate limit") || msg.includes("too many"))
    return "Too many attempts. Please wait a moment before trying again.";
  if (code === "INVALID_OTP" || msg.includes("invalid") || msg.includes("expired"))
    return "Invalid or expired code. Please request a new one.";

  return error.message || "Something went wrong. Please try again.";
}

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "verify">("details");
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const regForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setStep("details");
    setOtpValue("");
    setCountdown(0);
    setLoginError(null);
    setRegisterError(null);
  };

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoginError(null);
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const code = (error.code ?? "").toUpperCase();
        const msg = (error.message ?? "").toLowerCase();
        const isUnverified =
          code === "EMAIL_NOT_VERIFIED" || msg.includes("not verified");

        if (isUnverified) {
          regForm.setValue("email", values.email);
          setStep("verify");
          setActiveTab("register");
          toast.info("Your email isn't verified. Enter the code we just sent.");
          await authClient.emailOtp.sendVerificationOtp({
            email: values.email,
            type: "email-verification",
          });
          setCountdown(30);
        } else {
          const message = getAuthError(error);
          setLoginError(message);
          toast.error(message);
        }
        return;
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch {
      const message = "An unexpected error occurred. Please try again.";
      setLoginError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    setRegisterError(null);
    setLoading(true);
    try {
      const { error } = await (authClient.signUp.email as Function)({
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      if (error) {
        const message = getAuthError(error);
        setRegisterError(message);
        toast.error(message);
        return;
      }

      toast.success("Account created! Check your email for the verification code.");
      setStep("verify");
      setCountdown(30);
    } catch {
      const message = "Registration failed. Please try again.";
      setRegisterError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const sendFreshCode = async () => {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: regForm.getValues("email"),
      type: "email-verification",
    });
    if (error) throw error;
    setOtpValue("");
    setCountdown(30);
  };

  const verifyOTP = async () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: regForm.getValues("email"),
        otp: otpValue,
      });

      if (error) {
        const msg = (error.message ?? "").toLowerCase();
        const isExpired = msg.includes("expired") || msg.includes("otp expired");

        // Always unblock resend so the user is never stuck
        setCountdown(0);
        setOtpValue("");

        if (isExpired) {
          try {
            await sendFreshCode();
            toast.info("Code expired — a new one has been sent to your email.");
          } catch {
            toast.error("Code expired. Click 'Resend' below to get a new one.");
          }
        } else {
          toast.error(getAuthError(error));
        }
        return;
      }

      toast.success("Email verified! Signing you in…");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await sendFreshCode();
      toast.success("A new code has been sent!");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-none overflow-hidden py-0 border-2 border-indigo-950">
      <CardHeader className="border-b-2 border-indigo-950 bg-indigo-50 p-6">
        <CardTitle className="text-xl font-black uppercase italic text-indigo-950">
          Jijenge Swiftsoko
        </CardTitle>
        {activeTab === "register" && (
          <div className="font-mono italic w-fit text-xs font-bold border-2 border-indigo-950 bg-indigo-600 px-2 py-1 text-white">
            {step === "details" ? "Step 1: Account Info" : "Step 2: Verify Email"}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-2 mb-8 rounded-none border-2 border-indigo-950 bg-indigo-100">
            <TabsTrigger
              value="login"
              className="rounded-none font-bold uppercase data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-none font-bold uppercase data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>

          {/* ── LOGIN ─────────────────────────────────── */}
          <TabsContent value="login">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                {loginError && (
                  <div className="border-2 border-red-600 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 uppercase tracking-wide">
                    {loginError}
                  </div>
                )}
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="EMAIL@DOMAIN.COM"
                          autoComplete="email"
                          {...field}
                          className="rounded-none border-2 border-indigo-950 font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                          className="rounded-none border-2 border-indigo-950 font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-none border-2 border-indigo-950 bg-indigo-600 text-white font-black uppercase h-12"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Sign In →"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* ── REGISTER ──────────────────────────────── */}
          <TabsContent value="register">
            <Form {...regForm}>
              <form
                onSubmit={regForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                {step === "details" ? (
                  <div className="space-y-3 animate-in fade-in">
                    {registerError && (
                      <div className="border-2 border-red-600 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 uppercase tracking-wide">
                        {registerError}
                      </div>
                    )}
                    <FormField
                      control={regForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="EMAIL@DOMAIN.COM"
                              autoComplete="email"
                              {...field}
                              className="rounded-none border-2 border-indigo-950 font-bold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={regForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="First"
                                autoComplete="given-name"
                                {...field}
                                className="rounded-none border-2 border-indigo-950 font-bold"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={regForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Last"
                                autoComplete="family-name"
                                {...field}
                                className="rounded-none border-2 border-indigo-950 font-bold"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={regForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="8+ characters"
                              autoComplete="new-password"
                              {...field}
                              className="rounded-none border-2 border-indigo-950 font-bold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={regForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Repeat password"
                              autoComplete="new-password"
                              {...field}
                              className="rounded-none border-2 border-indigo-950 font-bold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-none border-2 h-12 border-indigo-950 bg-indigo-700 text-white font-black uppercase"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Create Account →"
                      )}
                    </Button>
                  </div>
                ) : (
                  /* ── OTP VERIFY STEP ──────────────────── */
                  <div className="space-y-4 animate-in zoom-in-95">
                    <div className="p-4 border-2 border-indigo-950 bg-yellow-300 text-center">
                      <p className="text-xs font-black uppercase">
                        Verification Code Sent
                      </p>
                      <p className="text-[10px] mt-1 text-indigo-900">
                        Check{" "}
                        <span className="font-bold">
                          {regForm.getValues("email")}
                        </span>
                      </p>
                    </div>

                    <Input
                      value={otpValue}
                      onChange={(e) =>
                        setOtpValue(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      inputMode="numeric"
                      maxLength={6}
                      className="h-14 rounded-none border-2 border-indigo-950 text-center text-2xl font-black tracking-[0.5em]"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setStep("details");
                          setOtpValue("");
                        }}
                        className="rounded-none h-12 border-2 border-indigo-950"
                      >
                        <ArrowLeft />
                      </Button>
                      <Button
                        type="button"
                        onClick={verifyOTP}
                        disabled={loading || otpValue.length < 6}
                        className="flex-1 h-12 rounded-none border-2 border-indigo-950 bg-indigo-600 text-white font-black uppercase"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Verify Identity →"
                        )}
                      </Button>
                    </div>

                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={loading || countdown > 0}
                      className="w-full text-center text-[10px] font-black uppercase text-indigo-900 hover:underline disabled:opacity-50"
                    >
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Didn't get a code? Resend"}
                    </button>
                  </div>
                )}
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* ── GOOGLE OAUTH (always visible) ─────────── */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-indigo-950" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black">
            <span className="bg-white px-3 text-indigo-900">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full rounded-none border-2 border-indigo-950 font-black uppercase h-12"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/" })
          }
        >
          <Mail className="mr-2 h-4 w-4" /> Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
