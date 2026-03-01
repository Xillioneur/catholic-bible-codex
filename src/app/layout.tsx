import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Crimson_Pro } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Catholic Bible Codex – The Catholic Bible",
  description: "A premium, modern PWA for reading, studying, and praying with the full Catholic Bible.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${crimson.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
