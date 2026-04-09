"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const exampleIdeas = [
  "a pizza rating site for my friends",
  "a portfolio for my art projects",
  "a fan page for my favorite band",
  "a countdown to summer break",
  "a recipe app for my family",
  "a study group finder for school",
  "a local skate spot directory",
];

export function Hero() {
  const [currentIdea, setCurrentIdea] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const idea = exampleIdeas[currentIdea];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < idea.length) {
      timeout = setTimeout(() => {
        setDisplayText(idea.slice(0, displayText.length + 1));
      }, 50);
    } else if (!isDeleting && displayText.length === idea.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 30);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentIdea((prev) => (prev + 1) % exampleIdeas.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIdea]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#14B8A6]/5 blur-[120px] animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm mb-8">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">
              No coding required. Seriously.
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="gradient-text">Talk to Build.</span>
          <br />
          <span className="text-foreground">Launch to Learn.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Describe your dream website. Our AI builds it. You get a real live
          URL. All in minutes.
        </motion.p>

        {/* Typing demo */}
        <motion.div
          className="mx-auto max-w-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass rounded-2xl p-4 sm:p-6 shadow-xl">
            <p className="text-sm text-muted-foreground mb-2 text-left">
              I want to build...
            </p>
            <div className="text-left text-lg sm:text-xl font-medium min-h-[2rem]">
              <span>{displayText}</span>
              <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-typing-cursor" />
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/signup">
            <Button variant="glow" size="xl" className="group">
              <Sparkles className="h-5 w-5" />
              Start Building — It&apos;s Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg">
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Built for students in grades 6-12. Trusted by schools everywhere.
        </motion.p>
      </div>
    </section>
  );
}
