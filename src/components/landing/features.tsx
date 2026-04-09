"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Eye,
  Gamepad2,
  Rocket,
  Code2,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "Talk to Build",
    description:
      "Just describe what you want in plain English. Our AI asks the right questions and builds exactly what you need.",
    color: "text-[#7C3AED]",
    bg: "bg-[#7C3AED]/10",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description:
      "Watch your website come to life in real time as the AI writes it. Every line of code appears before your eyes.",
    color: "text-[#FB7185]",
    bg: "bg-[#FB7185]/10",
  },
  {
    icon: Gamepad2,
    title: "Founder's Lab",
    description:
      "Play product strategy games while your site builds. Earn XP, level up your founder mindset, and learn to think like a CEO.",
    color: "text-[#14B8A6]",
    bg: "bg-[#14B8A6]/10",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Hit launch and your site goes live with a real URL. Share it with friends, family, or the whole school.",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
  {
    icon: Code2,
    title: "No Code Required",
    description:
      "Zero coding experience needed. The AI handles HTML, CSS, and JavaScript. You just bring your ideas.",
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
  },
  {
    icon: Share2,
    title: "Share & Remix",
    description:
      "Get a QR code to share. Come back anytime to add features, change colors, or completely remix your site.",
    color: "text-[#A855F7]",
    bg: "bg-[#A855F7]/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to{" "}
            <span className="gradient-text">ship something real</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to live website, EdAIBuilder handles the hard stuff so you
            can focus on being creative.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group">
                <CardContent className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
