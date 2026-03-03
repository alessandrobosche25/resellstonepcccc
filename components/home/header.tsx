"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/app/authcontext";
import { useSidebar } from "./sidebar-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Header({
  setSearchQuery,
}: {
  setSearchQuery?: (query: string) => void;
}) {
  const auth = useAuth();
  const { expanded } = useSidebar();
  const [notificationCount] = useState(3);
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const titles: Record<string, string> = {
      home: "Magazzino",
      ricerca: "Ricerca",
      notifiche: "Notifiche",
      preferiti: "Preferiti",
      fornitore: "Home Fornitore",
      addProduct: "Aggiungi Prodotto",
      statistiche: "Statistiche",
      boost: "Boost",
      subscription: "Abbonamenti",
      admin: "Dashboard Admin",
      utenti: "Gestione Utenti",
      abbonamenti: "Gestione Abbonamenti",
      prodotti: "Gestione Prodotti",
      monitoraggio: "Monitoraggio",
      profilo: "Profilo",
      help: "Supporto",
    };
    const last = segments[segments.length - 1];
    return titles[last] || "Dashboard";
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-card/70 backdrop-blur-xl border-b border-border/60 transition-all duration-300 flex items-center",
        expanded ? "left-64" : "left-[72px]"
      )}
    >
      <div className="flex items-center justify-between w-full px-6">
        {/* Page title */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Search trigger */}
          {setSearchQuery && (
            <button className="flex items-center gap-2 px-3.5 py-2 bg-muted/70 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors border border-border/40">
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Cerca...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-card rounded-md border border-border text-muted-foreground/70 ml-2">
                {"/"}
              </kbd>
            </button>
          )}

          {/* Notifications */}
          <Link href="/notifiche">
            <button className="relative p-2.5 rounded-xl bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/40">
              <Bell className="h-[18px] w-[18px]" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-30 animate-ping" />
                  <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-primary text-primary-foreground text-[9px] font-bold items-center justify-center">
                    {notificationCount}
                  </span>
                </span>
              )}
            </button>
          </Link>

          {/* Profile mini */}
          <Link href="/profilo">
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer border border-transparent hover:border-border/40">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden ring-2 ring-border/50">
                <Image
                  src={auth?.user?.fileBase64 || "/img/default-avatar.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-sm font-semibold text-foreground leading-tight truncate max-w-[120px]">
                  {auth?.user?.nomeAzienda || "Azienda"}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
