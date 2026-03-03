"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Heart,
  TrendingUp,
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Activity,
  Rocket,
  BarChart3,
  HelpCircle,
  Settings,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useAuth } from "@/app/authcontext";
import Image from "next/image";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const marmistaSection: NavSection = {
  title: "Area Marmista",
  items: [
    { href: "/home", icon: Home, label: "Magazzino" },
    { href: "/ricerca", icon: Search, label: "Ricerca" },
    { href: "/notifiche", icon: Bell, label: "Notifiche" },
    { href: "/preferiti", icon: Heart, label: "Preferiti" },
  ],
};

const fornitoreSection: NavSection = {
  title: "Area Fornitore",
  items: [
    { href: "/fornitore", icon: Layers, label: "Home" },
    { href: "/addProduct", icon: Plus, label: "Aggiungi Prodotto" },
    { href: "/statistiche", icon: BarChart3, label: "Statistiche" },
    { href: "/boost", icon: Rocket, label: "Boost" },
    { href: "/subscription", icon: CreditCard, label: "Abbonamenti" },
  ],
};

const adminSection: NavSection = {
  title: "Area Admin",
  items: [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/utenti", icon: Users, label: "Gestione Utenti" },
    { href: "/admin/abbonamenti", icon: CreditCard, label: "Abbonamenti" },
    { href: "/admin/prodotti", icon: Package, label: "Prodotti" },
    { href: "/admin/monitoraggio", icon: Activity, label: "Monitoraggio" },
  ],
};

const accountSection: NavSection = {
  title: "Account",
  items: [
    { href: "/profilo", icon: User, label: "Profilo" },
    { href: "/help", icon: HelpCircle, label: "Supporto" },
  ],
};

export function Sidebar() {
  const { expanded, toggleSidebar } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Errore durante il logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!mounted) return null;

  const sections = [marmistaSection, fornitoreSection, adminSection, accountSection];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 ease-in-out shadow-xl",
        expanded ? "w-64" : "w-[72px]"
      )}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-sidebar-border/60 px-4",
          expanded ? "justify-between" : "justify-center"
        )}
      >
        {expanded ? (
          <Link href="/home" className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/resellstoneLOGO.svg"
                alt="Resellstone"
                width={32}
                height={32}
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-sidebar-foreground font-bold text-base tracking-tight">
              Resellstone
            </span>
          </Link>
        ) : (
          <Link href="/home" className="flex items-center justify-center">
            <div className="relative w-8 h-8">
              <Image
                src="/resellstoneLOGO.svg"
                alt="Resellstone"
                width={32}
                height={32}
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-card text-muted-foreground border border-border rounded-full p-1.5 cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-lg z-50"
        aria-label={expanded ? "Comprimi sidebar" : "Espandi sidebar"}
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            {expanded && (
              <div className="px-5 mb-2.5">
                <p className="text-[10px] font-bold text-sidebar-foreground/35 uppercase tracking-[0.15em]">
                  {section.title}
                </p>
              </div>
            )}
            {!expanded && (
              <div className="mx-auto mb-2.5 w-8 border-t border-sidebar-border/40" />
            )}
            <ul className="flex flex-col gap-1 px-3">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                        expanded ? "" : "justify-center",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                      title={!expanded ? item.label : undefined}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                      )}
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-sidebar-foreground/45 group-hover:text-sidebar-foreground/70"
                        )}
                      />
                      {expanded && (
                        <span className="whitespace-nowrap truncate">
                          {item.label}
                        </span>
                      )}
                      {expanded && item.badge && (
                        <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                      {/* Tooltip for collapsed sidebar */}
                      {!expanded && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-sidebar text-sidebar-foreground text-xs font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-sidebar-border">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer - User + Logout */}
      <div className="border-t border-sidebar-border/60 p-3">
        {/* User info */}
        {expanded ? (
          <div className="flex items-center gap-3 px-2 py-2.5 mb-2 rounded-xl bg-sidebar-accent/30">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-sidebar-accent flex-shrink-0 ring-2 ring-sidebar-border/50">
              <Image
                src={auth?.user?.fileBase64 || "/img/default-avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
                {auth?.user?.nomeAzienda || "Azienda"}
              </p>
              <p className="text-[11px] text-sidebar-foreground/45 truncate">
                {auth?.user?.email || "email@example.com"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-2">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-sidebar-accent ring-2 ring-sidebar-border/50">
              <Image
                src={auth?.user?.fileBase64 || "/img/default-avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-sidebar-foreground/55 hover:bg-red-500/10 hover:text-red-400",
            expanded ? "" : "justify-center"
          )}
          title={!expanded ? "Esci" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {expanded && <span>{isLoggingOut ? "Uscita..." : "Esci"}</span>}
        </button>
      </div>
    </aside>
  );
}
