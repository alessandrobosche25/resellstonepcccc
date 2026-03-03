"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import { UsersTable } from "@/components/admin/users-table";

export default function AdminUtenti() {
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
              Gestione Utenti
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestisci utenti, ruoli e permessi della piattaforma
            </p>
          </div>
          <UsersTable />
        </div>
      </main>
    </div>
  );
}
