"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import { KpiCards } from "@/components/admin/kpi-cards";
import { RegistrationChart } from "@/components/admin/registration-chart";
import {
  PublishedMaterialsChart,
  SearchedMaterialsChart,
} from "@/components/admin/materials-chart";
import { UsersTable } from "@/components/admin/users-table";
import { Calendar, Download } from "lucide-react";

export default function AdminDashboard() {
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
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Dashboard Admin
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Panoramica completa della piattaforma Resellstone
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-xl text-sm font-semibold hover:bg-accent transition-colors border border-border/60">
                <Calendar className="h-4 w-4" />
                <span>Ultimi 30 giorni</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#6033E1] text-white rounded-xl text-sm font-bold hover:bg-[#4f29b8] transition-all shadow-md hover:shadow-lg">
                <Download className="h-4 w-4" />
                <span>Esporta Report</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <section className="mb-8">
            <KpiCards />
          </section>

          {/* Charts row */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <RegistrationChart />
            <div className="flex flex-col gap-6">
              <PublishedMaterialsChart />
            </div>
          </section>

          {/* Searched materials + Users table */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-1">
              <SearchedMaterialsChart />
            </div>
            <div className="xl:col-span-2">
              <UsersTable />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
