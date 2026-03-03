import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./authcontext";
import { AuthWrapper } from "@/components/shared/AuthComponent/AuthComponents";
import { SidebarProvider } from "@/components/home/sidebar-context";
import { MobileRedirect } from "@/components/shared/MobileRedirect";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Resellstone - Gestione Marmi e Pietre",
  description: "Software gestionale SaaS per il settore marmi e pietre naturali",
};

export const viewport: Viewport = {
  themeColor: "#6033E1",
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
      <body className={`${inter.variable} font-sans antialiased`}>
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
