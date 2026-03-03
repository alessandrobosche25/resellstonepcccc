"use client";

import {
  Users,
  Hammer,
  Truck,
  Activity,
  Eye,
  Rocket,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardData = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

const kpiData: KpiCardData[] = [
  {
    title: "Utenti Totali",
    value: "1,247",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "Marmisti",
    value: "843",
    change: "+8.2%",
    changeType: "positive",
    icon: Hammer,
    iconColor: "text-chart-2",
    iconBg: "bg-chart-2/10",
  },
  {
    title: "Fornitori",
    value: "404",
    change: "+5.1%",
    changeType: "positive",
    icon: Truck,
    iconColor: "text-chart-4",
    iconBg: "bg-chart-4/10",
  },
  {
    title: "Utenti Attivi",
    value: "892",
    change: "-2.3%",
    changeType: "negative",
    icon: Activity,
    iconColor: "text-chart-5",
    iconBg: "bg-chart-5/10",
  },
  {
    title: "Visualizzazioni Totali",
    value: "45.2K",
    change: "+18.7%",
    changeType: "positive",
    icon: Eye,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
  },
  {
    title: "Boost Attivi",
    value: "56",
    change: "+32.1%",
    changeType: "positive",
    icon: Rocket,
    iconColor: "text-chart-1",
    iconBg: "bg-chart-1/10",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
        <div
          key={kpi.title}
          className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl", kpi.iconBg)}>
              <Icon className={cn("h-5 w-5", kpi.iconColor)} />
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
                kpi.changeType === "positive"
                  ? "bg-chart-2/10 text-chart-2"
                  : kpi.changeType === "negative"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {kpi.changeType === "positive" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {kpi.change}
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground tracking-tight">
              {kpi.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.title}</p>
          </div>
        </div>
        );
      })}
    </div>
  );
}
