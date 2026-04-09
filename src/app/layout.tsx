import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EdAIBuilder — Talk to Build. Launch to Learn.",
  description:
    "Build real websites by just talking. An AI-powered platform for students to go from idea to live site in minutes — no coding required.",
  keywords: [
    "AI website builder",
    "student builder",
    "no code",
    "education",
    "teen builder",
  ],
  openGraph: {
    title: "EdAIBuilder — Talk to Build. Launch to Learn.",
    description:
      "Build real websites by just talking. No coding required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
