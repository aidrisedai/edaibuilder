"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Background glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to build{" "}
            <span className="gradient-text">something amazing?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Your idea deserves to exist on the internet. Let&apos;s make it
            happen — for free, in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="glow" size="xl" className="group">
                <Sparkles className="h-5 w-5" />
                Start Building Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever for students. No credit card needed.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
