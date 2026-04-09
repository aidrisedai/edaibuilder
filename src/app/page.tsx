import { Navbar } from "@/components/shared/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <footer className="border-t py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">EdAIBuilder</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EdAIBuilder. Built for students, by builders.
          </p>
        </div>
      </footer>
    </div>
  );
}
