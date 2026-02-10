import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AutoSyncProvider } from "@/components/auto-sync-provider";

export const metadata: Metadata = {
  title: "BOLT Mail Operations",
  description: "BOLT Mail Operations Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/themes/default.css"
          as="style"
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AutoSyncProvider>
            {children}
          </AutoSyncProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
