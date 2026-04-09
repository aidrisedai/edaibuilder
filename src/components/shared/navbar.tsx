"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow-lg group-hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-shadow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">EdAI</span>
            <span className="text-foreground">Builder</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {isLanding && (
            <>
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
            </>
          )}
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="glow" size="sm">
              Start Building
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t md:hidden animate-slide-up">
          <div className="flex flex-col gap-2 p-4">
            {isLanding && (
              <>
                <a
                  href="#features"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  How It Works
                </a>
              </>
            )}
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="glow" className="w-full">
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
