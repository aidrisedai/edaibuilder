"use client";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0D9488]">
        <span className="text-xs text-white font-bold">AI</span>
      </div>
      <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
