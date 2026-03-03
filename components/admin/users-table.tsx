"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserStatus = "active" | "trial" | "suspended" | "expired";
type UserRole = "marmista" | "fornitore" | "admin";

type UserRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  registeredAt: string;
};

const mockUsers: UserRow[] = [
  {
    id: "1",
    name: "Marco Rossi",
    email: "marco@example.com",
    company: "Marmi Rossi Srl",
    role: "fornitore",
    status: "active",
    lastActive: "2 ore fa",
    registeredAt: "15 Gen 2025",
  },
  {
    id: "2",
    name: "Giulia Bianchi",
    email: "giulia@example.com",
    company: "Pietre Bianchi",
    role: "marmista",
    status: "active",
    lastActive: "5 min fa",
    registeredAt: "22 Feb 2025",
  },
  {
    id: "3",
    name: "Luca Verdi",
    email: "luca@example.com",
    company: "Graniti Verdi Spa",
    role: "fornitore",
    status: "trial",
    lastActive: "1 giorno fa",
    registeredAt: "10 Mar 2025",
  },
  {
    id: "4",
    name: "Anna Ferrari",
    email: "anna@example.com",
    company: "Ferrari Marmi",
    role: "marmista",
    status: "suspended",
    lastActive: "2 settimane fa",
    registeredAt: "05 Nov 2024",
  },
  {
    id: "5",
    name: "Paolo Colombo",
    email: "paolo@example.com",
    company: "Colombo Stone",
    role: "fornitore",
    status: "expired",
    lastActive: "1 mese fa",
    registeredAt: "18 Set 2024",
  },
  {
    id: "6",
    name: "Sara Moretti",
    email: "sara@example.com",
    company: "Moretti & Co",
    role: "marmista",
    status: "active",
    lastActive: "30 min fa",
    registeredAt: "01 Dic 2024",
  },
  {
    id: "7",
    name: "Davide Bruno",
    email: "davide@example.com",
    company: "Bruno Pietre",
    role: "admin",
    status: "active",
    lastActive: "Online",
    registeredAt: "01 Gen 2024",
  },
];

const statusConfig: Record<
  UserStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Attivo",
    className: "bg-chart-2/10 text-chart-2",
  },
  trial: {
    label: "Free Trial",
    className: "bg-chart-4/10 text-chart-4",
  },
  suspended: {
    label: "Sospeso",
    className: "bg-destructive/10 text-destructive",
  },
  expired: {
    label: "Scaduto",
    className: "bg-muted text-muted-foreground",
  },
};

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  marmista: {
    label: "Marmista",
    className: "bg-chart-1/10 text-chart-1",
  },
  fornitore: {
    label: "Fornitore",
    className: "bg-chart-3/10 text-chart-3",
  },
  admin: {
    label: "Admin",
    className: "bg-chart-5/10 text-chart-5",
  },
};

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | UserRole>("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-card rounded-2xl border border-border">
      {/* Table header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">
              Gestione Utenti
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredUsers.length} utenti trovati
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca utente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-[220px]"
              />
            </div>
            {/* Filter chips */}
            <div className="flex items-center gap-1.5">
              {(["all", "marmista", "fornitore", "admin"] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                      selectedFilter === filter
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {filter === "all"
                      ? "Tutti"
                      : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                Utente
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                Azienda
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                Ruolo
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                Stato
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                Ultima Attivita
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/50 transition-colors",
                  index === filteredUsers.length - 1 && "border-b-0"
                )}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-card-foreground">{user.company}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
                      roleConfig[user.role].className
                    )}
                  >
                    {roleConfig[user.role].label}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
                      statusConfig[user.status].className
                    )}
                  >
                    {statusConfig[user.status].label}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-muted-foreground">
                    {user.lastActive}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Visualizza"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Modifica"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Mostrando 1-{filteredUsers.length} di {filteredUsers.length} risultati
        </p>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40" disabled>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
            3
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
