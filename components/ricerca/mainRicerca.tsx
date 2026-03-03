"use client";

import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/home/sidebar-context";
import { useAuth } from "@/app/authcontext";
import { LoadingSpinner } from "@/components/home/loading-spinner";
import { PropertyCardRicerca } from "@/components/ricerca/property-card-ricerca";
import { SearchMagazzinoModalContent } from "@/components/home/magazzino-modal-content";
import { Modal } from "@/components/home/modalCard";
import { motion, AnimatePresence } from "framer-motion";
import type { IMagazzino } from "@/types/magazzino";
import type { IUsers } from "@/types/utente";
import Fuse from "fuse.js";

export default function Magazzino({ searchQuery }: { searchQuery: string }) {
  const { expanded } = useSidebar();
  const { user } = useAuth();
  const [magazzino, setMagazzino] = useState<IMagazzino[]>([]);
  const [magazzinoTot, setMagazzinoTot] = useState<IMagazzino[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // State per il filtro: usiamo selectedFinish come oggetto che identifica la finitura selezionata
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
  const [isUserData, setIsUserData] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Funzione che calcola le distanze per ogni item
  async function associaDistanza(data: IMagazzino[]) {
    const distances: { [key: string]: string } = {};
    const users: { [key: string]: IUsers } = {};
    for (const item of data) {
      try {
        const userResponse = await fetch("/api/getUtenteByEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: item.email }),
        });
        const userData = await userResponse.json();
        if (userData && userData.success !== false) {
          const result = await calculateDistance(
            user?.indirizzo, // indirizzo di partenza
            userData.indirizzo
          );
          distances[item.email] = result?.distance;
          users[item.email] = userData;
        }
      } catch (error) {
        console.error("Errore nel recupero dati utente:", error);
      }
    }
    setDizDistanze(distances);
    setDizUtenti(users as { [key: string]: IUsers });
    setIsLoading(false);
    console.log("dizDistanze aggiornato:", distances);
  }

  // Se viene usata la ricerca, si aggiorna il magazzino a partire dalla query
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      async function fetchMagazzinoByQuery() {
        setIsLoading(true);
        try {
          const res = await fetch("/api/getMagazzino", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (data.success !== false) {
            const fuse = new Fuse(data, {
              keys: ["nome"],
              threshold: 0.3,
            });
            const filteredData = fuse
              .search(searchQuery)
              .map((result) => result.item as IMagazzino);
            // Se la ricerca viene fatta, si usa il risultato come “base” per i filtri
            setIsUserData(false);

            // Escludiamo gli item che appartengono all'utente corrente
            const userFilteredData = filteredData.filter(
              (item) => item.email !== user?.email
            );

            setMagazzinoTot(userFilteredData);
            setMagazzino(userFilteredData);
            associaDistanza(userFilteredData);

            if (userFilteredData.length < 0) {
              setShowFilters(false);
            }
          }
        } catch (error) {
          console.error("Errore durante la ricerca nel magazzino:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMagazzinoByQuery();
    }
  }, [searchQuery]);

  // Effettua il filtraggio combinato in base ai filtri attivi (finitura e distanza)
  useEffect(() => {
    // Partiamo dallo stato completo
    let filtered = [...magazzinoTot];

    // Applica il filtro per finitura se selezionato (otteniamo un array di finiture attive)
    const finishActive = Object.entries(selectedFinish)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key.toLowerCase());

    if (finishActive.length > 0) {
      filtered = filtered.filter((item) =>
        finishActive.includes(item.finitura.toLowerCase())
      );
    }

    // Applica il filtro per la distanza se impostato
    if (distance !== null) {
      filtered = filtered.filter((item) => {
        const distText = dizDistanze[item.email];
        if (distText) {
          const distanzaNum = parseFloat(distText.replace(/[^0-9.-]+/g, ""));
          return distanzaNum <= distance;
        }
        return false;
      });
    }

    setMagazzino(filtered);
  }, [selectedFinish, distance, magazzinoTot, dizDistanze]);

  // Gestione selezione di un item
  const handleSelectItem = (item: IMagazzino) => {
    setSelectedItem(item);
    setIsModalOpen(true); //controllo se ha gia associata la distanza e l utente
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Funzione per il toggle della selezione della finitura: viene gestita la selezione in modo esclusivo
  const toggleFinishSelection = (filter: string) => {
    setSelectedFinish((prev) => {
      // Inizialmente resetta tutte le selezioni
      const updated = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      // Imposta la selezione per il filtro cliccato (effettua il toggle)
      updated[filter] = !prev[filter];
      return updated;
    });
  };

  // Per la distanza il pulsante aggiorna lo state in maniera diretta:
  const handleDistanceSelection = (km: number) => {
    setDistance((prev) => (prev === km ? null : km));
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
    setDistance(null);
  };

  // Funzione di utilità per calcolare la distanza
  const calculateDistance = async (origin: string, destination: string) => {
    if (!destination) return { distance: "", duration: "" };
    console.log("SONO DENTRO CALCULATE DISTANCE");
    const response = await fetch("/api/getDistance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ origins: origin, destinations: destination }),
    });

    const data = await response.json();

    if (data.status === "OK") {
      const distance = data.rows[0].elements[0].distance.text;
      const duration = data.rows[0].elements[0].duration.text;
      console.log(`Distanza: ${distance}, Tempo di percorrenza: ${duration}`);
      return { distance, duration };
    } else {
      console.error("Errore nella risposta dell'API:", data.error_message);
    }
  };

  return (
    <main
      className={cn(
        "pt-14 min-h-screen bg-gray-50 transition-all",
        expanded ? "ml-56" : "ml-16"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {!searchQuery ? "Ricerca Materiali" : "Risultati ricerca"}
          </h1>
          <button
            onClick={() =>
              magazzino.length > 0 ? setShowFilters((prev) => !prev) : null
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "bg-[#6033E1] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>{showFilters ? "Nascondi filtri" : "Mostra filtri"}</span>
          </button>
        </div>

        {/* Filtri */}
        <AnimatePresence>
          {showFilters && !isUserData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Filtro finitura */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Tipologia Finitura
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedFinish[filter]
                              ? "bg-[#6033E1] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtro distanza */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Distanza Massima
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[10, 30, 50, 100, 250, 500].map((km) => (
                        <button
                          key={km}
                          onClick={() => handleDistanceSelection(km)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            distance === km
                              ? "bg-[#6033E1] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {km} km
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filtri attivi */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 items-center">
                    {Object.entries(selectedFinish).some(
                      ([_, active]) => active
                    ) || distance ? (
                      <>
                        {Object.entries(selectedFinish).map(
                          ([filter, active]) =>
                            active && (
                              <span
                                key={filter}
                                className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {filter.charAt(0).toUpperCase() +
                                  filter.slice(1)}
                              </span>
                            )
                        )}
                        {distance && (
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {distance} km
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Nessun filtro attivo
                      </span>
                    )}
                  </div>

                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#6033E1] hover:text-[#4f29b8] font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid risultati */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : magazzino.length > 0 ? (
            magazzino.map((item: IMagazzino) => (
              <PropertyCardRicerca
                key={item._id}
                magazzino={item}
                onClick={() => handleSelectItem(item)}
                distanza={
                  dizDistanze[item.email]
                    ? parseFloat(dizDistanze[item.email])
                    : undefined
                }
                nomeAzienda={dizUtenti[item.email]?.nomeAzienda}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Nessun risultato trovato
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <SearchMagazzinoModalContent
            magazzino={selectedItem}
            distanza={dizDistanze[selectedItem.email]}
            utente={dizUtenti[selectedItem.email]}
          />
        </Modal>
      )}
    </main>
  );
}

const calculateDistance = async (origin: string, destination: string) => {
  if (!destination) return { distance: "", duration: "" };
  console.log("SONO DENTRO CALCULATE DISTANCE");
  const response = await fetch("/api/getDistance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ origins: origin, destinations: destination }),
  });

  const data = await response.json();

  if (data.status === "OK") {
    const distance = data.rows[0].elements[0].distance.text;
    const duration = data.rows[0].elements[0].duration.text;
    console.log(`Distanza: ${distance}, Tempo di percorrenza: ${duration}`);
    return { distance, duration };
  } else {
    console.error("Errore nella risposta dell'API:", data.error_message);
  }
};
