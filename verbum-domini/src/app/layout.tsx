import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Verbum Domini - Catholic Bible Codex",
  description: "A premium, modern Progressive Web Application for reading, studying, and praying with the full Catholic Bible (73-book canon).",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <SessionProvider>
          <TRPCReactProvider>
            <TooltipProvider>
              <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 min-w-0">
                  {children}
                </div>
                <Toaster position="top-center" />
              </SidebarProvider>
            </TooltipProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
