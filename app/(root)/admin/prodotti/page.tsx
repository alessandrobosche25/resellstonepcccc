"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export default function AdminProdotti() {
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
              Gestione Prodotti
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Modera i contenuti e gestisci i boost dei prodotti
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center min-h-[400px]">
            <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-semibold text-card-foreground mb-1">
              Griglia moderazione prodotti
            </p>
            <p className="text-sm text-muted-foreground">
              Controllo contenuti con azioni di eliminazione e gestione boost
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
