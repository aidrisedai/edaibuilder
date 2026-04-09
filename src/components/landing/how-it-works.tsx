"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  MessageCircle,
  Gamepad2,
  Rocket,
  Repeat,
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Lightbulb,
    title: "The Spark",
    description:
      "Type or speak your website idea. \"I want a site where my friends can rate pizza places.\"",
    color: "#F59E0B",
  },
  {
    number: 2,
    icon: MessageCircle,
    title: "The Interview",
    description:
      "Our AI asks smart questions — one at a time. \"Do you need user logins?\" \"Should there be a leaderboard?\"",
    color: "#7C3AED",
  },
  {
    number: 3,
    icon: Gamepad2,
    title: "Founder's Lab",
    description:
      "While your site builds, play product strategy games and earn XP. The wait becomes the lesson.",
    color: "#14B8A6",
  },
  {
    number: 4,
    icon: Rocket,
    title: "The Launch",
    description:
      "Your site goes live with a real URL. Get a QR code and shareable card to send to friends.",
    color: "#22C55E",
  },
  {
    number: 5,
    icon: Repeat,
    title: "The Remix",
    description:
      "Come back anytime. Say \"Add a photo upload\" or \"Make it blue.\" The AI updates your live site.",
    color: "#FB7185",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            From idea to live site in{" "}
            <span className="gradient-text">5 steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No tutorials. No setup. No boring stuff. Just your idea and a few
            minutes.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F59E0B] via-[#7C3AED] to-[#FB7185] hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative flex items-start gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step circle */}
                <div
                  className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon
                    className="h-7 w-7"
                    style={{ color: step.color }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-bold tracking-wider uppercase"
                      style={{ color: step.color }}
                    >
                      Step {step.number}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
