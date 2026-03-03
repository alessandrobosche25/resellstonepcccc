"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const publishedMaterials = [
  { name: "Marmo Bianco", count: 245 },
  { name: "Granito Nero", count: 198 },
  { name: "Travertino", count: 167 },
  { name: "Ardesia", count: 134 },
  { name: "Onice", count: 98 },
  { name: "Quarzite", count: 87 },
];

const searchedMaterials = [
  { name: "Marmo Calacatta", searches: 1240 },
  { name: "Marmo Statuario", searches: 980 },
  { name: "Granito Galaxy", searches: 756 },
  { name: "Travertino Romano", searches: 654 },
  { name: "Onice Verde", searches: 432 },
  { name: "Ardesia Ligure", searches: 321 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0].value}</p>
    </div>
  );
}

export function PublishedMaterialsChart() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-bold text-foreground tracking-tight">
          Materiali Pubblicati
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Top materiali per numero di inserzioni
        </p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={publishedMaterials}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#e5e7eb"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={110}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#6033E1"
              radius={[0, 8, 8, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SearchedMaterialsChart() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-bold text-foreground tracking-tight">
          Materiali Ricercati
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Top ricerche nella piattaforma
        </p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={searchedMaterials}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#e5e7eb"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={130}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="searches"
              fill="#10b981"
              radius={[0, 8, 8, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
