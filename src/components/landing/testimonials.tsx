"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Maya T.",
    grade: "8th Grade",
    initials: "MT",
    quote:
      "I built a fan page for my favorite K-pop group in like 15 minutes. My friends couldn't believe I made it myself!",
    stars: 5,
  },
  {
    name: "Jordan K.",
    grade: "10th Grade",
    initials: "JK",
    quote:
      "The Founder's Lab games are actually fire. I learned more about business in one session than a whole semester of econ.",
    stars: 5,
  },
  {
    name: "Ms. Rodriguez",
    grade: "CS Teacher",
    initials: "MR",
    quote:
      "My students went from 'I can't code' to showing off live websites to their parents. The class code system makes management easy.",
    stars: 5,
  },
  {
    name: "Alex P.",
    grade: "7th Grade",
    initials: "AP",
    quote:
      "I made a website for my dog walking business and now I actually have customers from the QR code. This is insane.",
    stars: 5,
  },
  {
    name: "Sam W.",
    grade: "11th Grade",
    initials: "SW",
    quote:
      "I put my EdAIBuilder projects in my college application portfolio. The Founder's Journal shows all my product thinking.",
    stars: 5,
  },
  {
    name: "Coach Davis",
    grade: "PE Teacher",
    initials: "CD",
    quote:
      "I'm not a tech teacher but I used EdAIBuilder to have my team build their own sports stat pages. They loved it.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Students are{" "}
            <span className="gradient-text">already shipping</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real builders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.grade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
