"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FolderOpen,
  Copy,
  Check,
  Plus,
  GraduationCap,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { generateClassCode, formatRelativeTime } from "@/lib/utils";
import type { User, TeacherClass } from "@/types/database";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [creatingClass, setCreatingClass] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [classesRes, studentsRes] = await Promise.all([
      supabase
        .from("teacher_classes")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("users")
        .select("*")
        .eq("teacher_id", user.id)
        .order("last_active_at", { ascending: false }),
    ]);

    if (classesRes.data) setClasses(classesRes.data);
    if (studentsRes.data) setStudents(studentsRes.data);
    setLoading(false);
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreatingClass(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const classCode = generateClassCode();
    const { error } = await supabase.from("teacher_classes").insert({
      teacher_id: user.id,
      name: newClassName.trim(),
      class_code: classCode,
    });

    if (error) {
      toast.error("Couldn't create class. Try again!");
    } else {
      toast.success(`Class "${newClassName}" created! Code: ${classCode}`);
      setNewClassName("");
      loadData();
    }
    setCreatingClass(false);
  }

  function handleCopyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Class code copied!");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your classes and track student progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
              <GraduationCap className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{classes.length}</p>
              <p className="text-xs text-muted-foreground">Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]/10">
              <Users className="h-5 w-5 text-[#14B8A6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <FolderOpen className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {students.reduce(() => 0, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Projects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create class */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a New Class</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateClass} className="flex gap-2">
            <Input
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Class name (e.g., Period 3 CS)"
              className="flex-1"
            />
            <Button type="submit" disabled={creatingClass}>
              <Plus className="h-4 w-4" />
              {creatingClass ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Classes */}
      {classes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Classes</h2>
          <div className="grid gap-4">
            {classes.map((cls) => (
              <Card key={cls.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{cls.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {students.filter((s) => s.class_code === cls.class_code).length}{" "}
                      students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm tracking-widest">
                      {cls.class_code}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyCode(cls.class_code)}
                    >
                      {copiedCode === cls.class_code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Students table */}
      {students.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Students</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Username
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Grade
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        XP
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b last:border-0">
                        <td className="p-3 font-medium">
                          {student.display_name}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          @{student.username}
                        </td>
                        <td className="p-3">
                          {student.grade_level
                            ? `${student.grade_level}th`
                            : "—"}
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-amber-500" />
                            {student.founder_xp}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {formatRelativeTime(student.last_active_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
