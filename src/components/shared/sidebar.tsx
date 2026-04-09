"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  Settings,
  Sparkles,
  LogOut,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Projects", href: "/dashboard?tab=projects", icon: FolderOpen },
  { name: "Founder's Journal", href: "/journal", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out. See you next time!");
    router.push("/");
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow group-hover:shadow-lg transition-shadow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">EdAI</span>
            <span className="text-foreground">Builder</span>
          </span>
        </Link>
      </div>

      {/* New project button */}
      <div className="p-4">
        <Link href="/dashboard?new=true">
          <Button variant="glow" className="w-full" size="sm">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href.split("?")[0]);
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

      {/* Bottom section */}
      <div className="border-t p-4 space-y-2">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-9 w-9">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
