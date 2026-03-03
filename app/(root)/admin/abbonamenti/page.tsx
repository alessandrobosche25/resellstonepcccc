"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import { CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";

const subscriptionGroups = [
  {
    title: "Abbonati Attivi",
    count: 312,
    icon: CheckCircle2,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    title: "Free Trial",
    count: 87,
    icon: Clock,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    title: "Scaduti",
    count: 45,
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

export default function AdminAbbonamenti() {
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
              Gestione Abbonamenti
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Monitora e gestisci gli abbonamenti della piattaforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {subscriptionGroups.map((group) => (
              <div
                key={group.title}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("p-2.5 rounded-xl", group.bg)}>
                    <group.icon className={cn("h-5 w-5", group.color)} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {group.title}
                  </span>
                </div>
                <p className="text-3xl font-bold text-card-foreground">
                  {group.count}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center min-h-[300px]">
            <CreditCard className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-semibold text-card-foreground mb-1">
              Tabella abbonamenti
            </p>
            <p className="text-sm text-muted-foreground">
              Lista completa degli abbonamenti con toggle attivazione/disattivazione
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
