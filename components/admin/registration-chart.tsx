"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const registrationData = [
  { month: "Gen", marmisti: 45, fornitori: 22 },
  { month: "Feb", marmisti: 52, fornitori: 28 },
  { month: "Mar", marmisti: 61, fornitori: 31 },
  { month: "Apr", marmisti: 58, fornitori: 35 },
  { month: "Mag", marmisti: 72, fornitori: 42 },
  { month: "Giu", marmisti: 85, fornitori: 48 },
  { month: "Lug", marmisti: 78, fornitori: 51 },
  { month: "Ago", marmisti: 65, fornitori: 38 },
  { month: "Set", marmisti: 90, fornitori: 55 },
  { month: "Ott", marmisti: 98, fornitori: 60 },
  { month: "Nov", marmisti: 110, fornitori: 68 },
  { month: "Dic", marmisti: 125, fornitori: 75 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-card-foreground font-medium">
            {entry.name === "marmisti" ? "Marmisti" : "Fornitori"}:
          </span>
          <span className="text-card-foreground font-bold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function RegistrationChart() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">
            Trend Registrazioni
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Nuovi utenti per mese
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-chart-1" />
            <span className="text-xs font-medium text-muted-foreground">
              Marmisti
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-chart-2" />
            <span className="text-xs font-medium text-muted-foreground">
              Fornitori
            </span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={registrationData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMarmisti" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.15 240)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.45 0.15 240)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFornitori" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.60 0.14 175)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.60 0.14 175)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="oklch(0.92 0.005 240)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "oklch(0.55 0.015 240)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "oklch(0.55 0.015 240)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="marmisti"
              stroke="oklch(0.45 0.15 240)"
              strokeWidth={2.5}
              fill="url(#colorMarmisti)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "oklch(0.45 0.15 240)", fill: "white" }}
            />
            <Area
              type="monotone"
              dataKey="fornitori"
              stroke="oklch(0.60 0.14 175)"
              strokeWidth={2.5}
              fill="url(#colorFornitori)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "oklch(0.60 0.14 175)", fill: "white" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
