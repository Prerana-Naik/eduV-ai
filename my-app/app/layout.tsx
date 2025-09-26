// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SupabaseProvider } from "./SupabaseProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduVerse AI - Your Smart Learning Companion",
  description: "AI-powered educational assistant with personalized learning for students and teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full m-0 p-0 overflow-x-hidden`}>
        <SupabaseProvider>
        
            <SidebarProvider>
              <div className="min-h-screen w-full">
                {children}
              </div>
            </SidebarProvider>
        
        </SupabaseProvider>
      </body>
    </html>
  );
}