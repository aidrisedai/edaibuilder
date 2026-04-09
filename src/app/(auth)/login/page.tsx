"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [username, setUsername] = useState("");
  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStudentLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Students log in with username as email (username@edaibuilder.local)
      const fakeEmail = `${username.toLowerCase()}@edaibuilder.local`;
      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: classCode,
      });

      if (error) {
        toast.error("Hmm, that didn't work. Check your username and class code!");
        return;
      }

      toast.success("Welcome back! Let's build something awesome.");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  async function handleTeacherLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Invalid email or password. Please try again.");
        return;
      }

      toast.success("Welcome back!");
      router.push("/teacher");
    } catch {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">EdAI</span>
            <span className="text-foreground">Builder</span>
          </span>
        </Link>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl tracking-tight">
              Welcome Back!
            </CardTitle>
            <CardDescription>
              {isTeacher
                ? "Log in to your teacher account"
                : "Enter your username and class code to continue"}
            </CardDescription>

            {/* Student/Teacher toggle */}
            <div className="flex items-center justify-center gap-1 mt-4 p-1 bg-muted rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isTeacher
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsTeacher(false)}
              >
                Student
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isTeacher
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsTeacher(true)}
              >
                Teacher
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {!isTeacher ? (
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="username">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="your-cool-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="classCode">
                    Class Code
                  </label>
                  <Input
                    id="classCode"
                    placeholder="ABC123"
                    value={classCode}
                    onChange={(e) =>
                      setClassCode(e.target.value.toUpperCase())
                    }
                    required
                    maxLength={6}
                    className="uppercase tracking-widest"
                  />
                </div>
                <Button
                  type="submit"
                  variant="glow"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Let's Go!"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="teacher@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="glow"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up for free
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
