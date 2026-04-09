"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Rocket,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStudentSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Use username as email for students (COPPA-friendly, no real email needed)
      const fakeEmail = `${username.toLowerCase()}@edaibuilder.local`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: classCode || "edaibuilder-default",
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: displayName || username,
            role: "student",
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast.error("That username is taken! Try a different one.");
        } else {
          toast.error("Oops! Something went wrong. Try again.");
        }
        return;
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            username: username.toLowerCase(),
            display_name: displayName || username,
            grade_level: gradeLevel ? parseInt(gradeLevel) : null,
            role: "student",
            class_code: classCode || null,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      toast.success("Account created! Let's build something amazing!");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  async function handleTeacherSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: "teacher",
          },
        },
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      if (authData.user) {
        await supabase.from("users").insert({
          id: authData.user.id,
          username: email.split("@")[0].toLowerCase(),
          display_name: displayName,
          role: "teacher",
        });
      }

      toast.success("Teacher account created! Check your email to verify.");
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
          className="flex items-center justify-center gap-2 mb-8"
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
              Join EdAIBuilder
            </CardTitle>
            <CardDescription>
              {isTeacher
                ? "Create a teacher account to manage your classes"
                : "Create your account and start building in minutes"}
            </CardDescription>

            {/* Student/Teacher toggle */}
            <div className="flex items-center justify-center gap-1 mt-4 p-1 bg-muted rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  !isTeacher
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsTeacher(false)}
              >
                <Rocket className="h-4 w-4" />
                Student
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isTeacher
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsTeacher(true)}
              >
                <GraduationCap className="h-4 w-4" />
                Teacher
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {!isTeacher ? (
              <form onSubmit={handleStudentSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="username">
                    Pick a username
                  </label>
                  <Input
                    id="username"
                    placeholder="cool-builder-42"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))
                    }
                    required
                    minLength={3}
                    maxLength={20}
                    autoComplete="username"
                  />
                  <p className="text-xs text-muted-foreground">
                    Letters, numbers, dashes, and underscores only
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="displayName">
                    Display name
                  </label>
                  <Input
                    id="displayName"
                    placeholder="What should we call you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="grade">
                      Grade
                    </label>
                    <select
                      id="grade"
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                    >
                      <option value="">Select</option>
                      {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={g}>
                          {g}th Grade
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="classCodeSignup">
                      Class code
                    </label>
                    <Input
                      id="classCodeSignup"
                      placeholder="Optional"
                      value={classCode}
                      onChange={(e) =>
                        setClassCode(e.target.value.toUpperCase())
                      }
                      maxLength={6}
                      className="uppercase tracking-widest"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="glow"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Start Building!"}
                  {!loading && <Rocket className="h-4 w-4" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTeacherSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="teacherName">
                    Your name
                  </label>
                  <Input
                    id="teacherName"
                    placeholder="Ms. Johnson"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="teacherEmail">
                    School email
                  </label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    placeholder="teacher@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="teacherPassword"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="teacherPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
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
                  {loading ? "Creating account..." : "Create Teacher Account"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
