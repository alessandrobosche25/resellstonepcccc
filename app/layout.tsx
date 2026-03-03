import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./authcontext";
import { AuthWrapper } from "@/components/shared/AuthComponent/AuthComponents";
import { SidebarProvider } from "@/components/home/sidebar-context";
import { MobileRedirect } from "@/components/shared/MobileRedirect";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Resellstone - Gestione Marmi e Pietre",
  description: "Software gestionale SaaS per il settore marmi e pietre naturali",
};

export const viewport: Viewport = {
  themeColor: "#1a1d2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <MobileRedirect />
        <AuthProvider>
          <AuthWrapper>
            <SidebarProvider>{children}</SidebarProvider>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
