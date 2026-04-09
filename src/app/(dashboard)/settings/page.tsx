"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types/database";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (data) {
        setUser(data);
        setDisplayName(data.display_name);
        setGradeLevel(data.grade_level?.toString() || "");
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({
        display_name: displayName,
        grade_level: gradeLevel ? parseInt(gradeLevel) : null,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Couldn't save changes. Try again!");
    } else {
      toast.success("Settings saved!");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your display name and grade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input value={user?.username || ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">
                Username can&apos;t be changed
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grade Level</label>
              <select
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
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm">
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
