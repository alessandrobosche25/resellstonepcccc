"use client";

import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Package,
  TrendingUp,
  Clock,
  Bell,
  Plus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/home/sidebar-context";
import { useAuth } from "@/app/authcontext";
import {
  LoadingSpinner,
  ProductGridSkeleton,
  NotificationSkeleton,
  RequestSkeleton,
} from "@/components/home/loading-spinner";
import { PropertyCard } from "@/components/home/property-card";
import { Modal } from "@/components/home/modalCard";
import { OwnMagazzinoModalContent } from "@/components/home/own-magazzino-modal-content";
import { motion, AnimatePresence } from "framer-motion";
import type { IMagazzino } from "@/types/magazzino";
import type { IUsers } from "@/types/utente";
import type { INotifiche } from "@/lib/database/models/notifiche.model";
import type { IRichiesteNotifiche } from "@/lib/database/models/richiesteNotifiche.model";
import useSWR, { mutate } from "swr";
import Link from "next/link";

const fetcher = (url: string, email: any) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then((res) => res.json());

export default function Magazzino({ searchQuery }: { searchQuery: string }) {
  const { expanded } = useSidebar();
  const { user } = useAuth();
  const [magazzino, setMagazzino] = useState<IMagazzino[]>([]);
  const [magazzinoTot, setMagazzinoTot] = useState<IMagazzino[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stato per il filtro: selectedFinish identifica la finitura selezionata
  const [selectedFinish, setSelectedFinish] = useState<{
    [key: string]: boolean;
  }>({
    lucido: false,
    grezzo: false,
    bocciardato: false,
    fiammato: false,
    spazzolato: false,
  });

  // Stato per la distanza selezionata
  const [distance, setDistance] = useState<number | null>(null);
  // dizDistanze contiene le distanze associate ad ogni item
  const [dizDistanze, setDizDistanze] = useState<{ [key: string]: string }>({}); // chiave email, valore distanza dall utente loggato
  const [dizUtenti, setDizUtenti] = useState<{ [key: string]: IUsers }>({}); // chiave email, valore utente associato a quell email
  const [selectedItem, setSelectedItem] = useState<IMagazzino | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch magazzino
  const {
    data: magazzinos,
    error: errormagazzino,
    isLoading: isLoadingMagazzino,
  } = useSWR<IMagazzino[]>(
    user.email ? [`/api/getMagazzinoByEmail`, user.email] : null,
    ([url, email]) => fetcher(url, email)
  );

  // Fetch notifiche
  const {
    data: notifiche,
    error: errorNotifiche,
    isLoading: isLoadingNotifiche,
  } = useSWR<INotifiche[]>(
    user?.email ? [`/api/getNotificheByEmail`, user?.email] : null,
    ([url, email]) => fetcher(url, email)
  );

  // Fetch richieste notifiche
  const {
    data: richiesteNotifiche,
    error: errorRichiesteNotifiche,
    isLoading: isLoadingRichiesteNotifiche,
  } = useSWR<IRichiesteNotifiche[]>(
    user?.email ? [`/api/getRichiesteNotificheByEmail`, user?.email] : null,
    ([url, email]) => fetcher(url, email)
  );

  // Recupera i dati del magazzino per l'utente loggato
  useEffect(() => {
    setIsLoading(isLoadingMagazzino);

    if (!errormagazzino && !isLoadingMagazzino && magazzinos) {
      setMagazzino(magazzinos);
      setMagazzinoTot(magazzinos);
    }
  }, [magazzinos, isLoadingMagazzino, errormagazzino]);

  // Effetto per filtrare i dati in base al filtro selezionato
  useEffect(() => {
    // Trova tutti i filtri attivi
    const activeFilters = Object.entries(selectedFinish)
      .filter(([_, isActive]) => isActive)
      .map(([filter]) => filter);

    // Se non c'è alcun filtro, mostra tutto
    if (activeFilters.length === 0) {
      setMagazzino(magazzinoTot);
    } else {
      // Filtra il magazzinoTot in base al campo "finitura"
      const filteredItems = magazzinoTot.filter((item) =>
        activeFilters.includes(item.finitura.toLowerCase())
      );
      setMagazzino(filteredItems);
    }
  }, [selectedFinish, magazzinoTot]);

  // Gestione selezione di un item
  const handleSelectItem = (item: IMagazzino) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Toggle per la selezione del filtro: resetta tutti i filtri e attiva solo quello cliccato
  const toggleFinishSelection = (filter: string) => {
    setSelectedFinish((prev) => {
      const updated = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      updated[filter] = !prev[filter];
      return updated;
    });
  };

  // Reset di tutti i filtri
  const resetFilters = () => {
    setMagazzino(magazzinoTot);
    setSelectedFinish({
      lucido: false,
      grezzo: false,
      bocciardato: false,
      fiammato: false,
      spazzolato: false,
    });
  };

  return (
    <div
      className="min-h-screen bg-background transition-all"
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 sm:mb-8">
          {/* Total Products */}
          <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                Prodotti
              </h3>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#6033E1]/10 flex items-center justify-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#6033E1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {magazzinoTot.length}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Totale
                </p>
              </div>
            </div>
          </div>

          {/* Filtered Products */}
          <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                Filtrati
              </h3>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {magazzino.length}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Dopo filtri</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Finiture</h3>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#6033E1]/10 flex items-center justify-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#6033E1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {new Set(magazzinoTot.map((item) => item.finitura)).size}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Tipologie
                </p>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                Filtri
              </h3>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {Object.values(selectedFinish).filter(Boolean).length}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Attivi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left: Products Grid */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Products Section */}
            <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Magazzino
                </h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      showFilters
                        ? "bg-[#6033E1] text-white shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-accent border border-border/60"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Filtri</span>
                  </button>
                  <Link
                    href="/addProduct"
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6033E1] hover:text-[#4f29b8] font-semibold transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Aggiungi</span>
                  </Link>
                </div>
              </div>

              {/* Filtri */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-muted/50">
                      <div className="mb-4">
                        <h3 className="text-xs sm:text-sm font-bold text-foreground mb-3">
                          Tipologia Finitura
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                          {[
                            "lucido",
                            "grezzo",
                            "bocciardato",
                            "fiammato",
                            "spazzolato",
                          ].map((filter) => (
                            <button
                              key={filter}
                              onClick={() => toggleFinishSelection(filter)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                selectedFinish[filter]
                                  ? "bg-[#6033E1] text-white shadow-md"
                                  : "bg-card text-muted-foreground hover:bg-accent border border-border/60"
                              }`}
                            >
                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Filtri attivi */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                        <div className="flex flex-wrap gap-2 items-center">
                          {Object.entries(selectedFinish).some(
                            ([_, active]) => active
                          ) ? (
                            Object.entries(selectedFinish).map(
                              ([filter, active]) =>
                                active && (
                                  <span
                                    key={filter}
                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-card text-foreground border border-border/60"
                                  >
                                    {filter.charAt(0).toUpperCase() +
                                      filter.slice(1)}
                                  </span>
                                )
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Nessun filtro attivo
                            </span>
                          )}
                        </div>
                        <button
                          onClick={resetFilters}
                          className="text-sm text-[#6033E1] hover:text-[#4f29b8] font-semibold transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {isLoading ? (
                    <ProductGridSkeleton count={8} />
                  ) : magazzino.length > 0 ? (
                    magazzino.map((item: IMagazzino) => (
                      <PropertyCard
                        key={item._id}
                        magazzino={item}
                        onSelect={handleSelectItem}
                        dizDistanze={dizDistanze}
                        dizUtenti={dizUtenti}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 text-muted-foreground">
                      <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-medium">Nessun prodotto nel magazzino</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar Widgets */}
          <div className="space-y-4 sm:space-y-6">
            {/* Notifiche Recenti */}
            <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-[#6033E1]/10 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-[#6033E1]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    Notifiche
                  </h3>
                </div>
                <Link
                  href="/notifiche"
                  className="text-xs sm:text-sm text-[#6033E1] hover:text-[#4f29b8] font-semibold transition-colors"
                >
                  Tutte
                </Link>
              </div>

              <div className="space-y-2.5">
                {isLoadingNotifiche ? (
                  <>
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                  </>
                ) : notifiche && notifiche.length > 0 ? (
                  notifiche.slice(0, 5).map((notifica: any, index: number) => (
                    <div
                      key={notifica._id || index}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#6033E1]/10 flex items-center justify-center flex-shrink-0">
                        <Bell className="h-5 w-5 text-[#6033E1]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {notifica.azienda || "Notifica"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notifica.text || notifica.message || ""}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1">
                          {notifica.tempo || ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Nessuna notifica</p>
                  </div>
                )}
              </div>
            </div>

            {/* Richieste Attive */}
            <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    Ricerche
                  </h3>
                </div>
                <span className="text-xs sm:text-sm font-semibold bg-muted px-2.5 py-1 rounded-lg text-muted-foreground">
                  {richiesteNotifiche?.length || 0}
                </span>
              </div>

              <div className="space-y-2.5">
                {isLoadingRichiesteNotifiche ? (
                  <>
                    <RequestSkeleton />
                    <RequestSkeleton />
                    <RequestSkeleton />
                  </>
                ) : richiesteNotifiche && richiesteNotifiche.length > 0 ? (
                  richiesteNotifiche
                    .slice(0, 5)
                    .map((richiesta: any, index: number) => (
                      <div
                        key={richiesta._id || index}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {richiesta.nomeMateriale || "Materiale"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Finitura: {richiesta.finitura || "N/A"}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                              Attiva
                            </span>
                            <span className="text-[11px] text-muted-foreground/60">
                              {richiesta.daysPassed || 0}g fa
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Nessuna ricerca attiva</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <OwnMagazzinoModalContent
            magazzino={selectedItem}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}
