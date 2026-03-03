"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export default function AdminMonitoraggio() {
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
        <div className="p-6 lg:p-8 max-w-[1400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Monitoraggio
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Log di accesso, modifiche, notifiche e segnalazioni
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center min-h-[400px]">
            <Activity className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-semibold text-card-foreground mb-1">
              Log di sistema
            </p>
            <p className="text-sm text-muted-foreground">
              Tabelle per accessi, modifiche, notifiche e report
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
