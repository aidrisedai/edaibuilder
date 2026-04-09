"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out.");
    router.push("/");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex h-screen w-64 flex-col border-r bg-card">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/teacher" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">EdAI</span>
              <span className="text-foreground">Builder</span>
            </span>
          </Link>
        </div>

        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              Teacher Mode
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4 flex items-center justify-between">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-9 w-9">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  );
}
