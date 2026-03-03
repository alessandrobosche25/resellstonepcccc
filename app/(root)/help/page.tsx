"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import { Mail, Phone, MessageCircle, QrCode, Headphones } from "lucide-react";

export default function Help() {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          expanded ? "ml-64" : "ml-[72px]"
        )}
      >
        <div className="p-6 lg:p-8 max-w-[1000px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Contatta Supporto Resellstone
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Scegli il canale che preferisci per contattarci
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* QR Code */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 mb-4">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                QR Code
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scansiona per assistenza immediata
              </p>
              <div className="w-32 h-32 bg-muted rounded-xl flex items-center justify-center">
                <QrCode className="h-16 w-16 text-muted-foreground/30" />
              </div>
            </div>

            {/* Email */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-chart-2/10 mb-4">
                <Mail className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                Email
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Rispondiamo entro 24 ore
              </p>
              <p className="text-sm font-semibold text-primary">
                supporto@resellstone.com
              </p>
            </div>

            {/* WhatsApp */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-chart-4/10 mb-4">
                <MessageCircle className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                WhatsApp
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat veloce con il team
              </p>
              <p className="text-sm font-semibold text-primary">
                +39 XXX XXX XXXX
              </p>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-chart-5/10 mb-4">
                <Phone className="h-6 w-6 text-chart-5" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                Telefono
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lun-Ven, 9:00 - 18:00
              </p>
              <p className="text-sm font-semibold text-primary">
                +39 XXX XXX XXXX
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
