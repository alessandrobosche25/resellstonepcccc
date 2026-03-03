"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Ruler,
  Package,
  MapPin,
  Building2,
  Mail,
  Phone,
  Navigation,
  Box,
} from "lucide-react";
import type { IMagazzino } from "@/types/magazzino";
import { IUsers } from "@/types/utente";

interface SearchMagazzinoModalContentProps {
  magazzino: IMagazzino;
  distanza?: string;
  utente?: IUsers;
}

export function SearchMagazzinoModalContent({
  magazzino,
  distanza,
  utente,
}: SearchMagazzinoModalContentProps) {
  const handleEmailContact = () => {
    if (!utente?.email) return;
    
    const subject = encodeURIComponent("Richiesta di informazioni");
    const body = encodeURIComponent(
      `Salve,\n\nVorrei avere maggiori informazioni su:\n\nProdotto: ${magazzino.nome}\nFinitura: ${magazzino.finitura}\nDimensioni: ${magazzino.lunghezza}x${magazzino.larghezza}x${magazzino.spessore}cm\nQuantità disponibile: ${magazzino.quantity}\n\nCordiali saluti`
    );
    
    window.location.href = `mailto:${utente.email}?subject=${subject}&body=${body}`;
  };

  const handleMapsDirection = () => {
    if (!utente?.indirizzo) return;
    
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      utente.indirizzo
    )}`;
    
    window.open(mapsUrl, "_blank");
  };
  return (
    <div className="overflow-y-auto max-h-[92vh]">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-8 border-b border-gray-200">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {magazzino.nome}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-gray-200 font-medium">
                  {magazzino.finitura === "0" ? "N/A" : magazzino.finitura}
                </span>
                {distanza && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#6033E1]" />
                    <span className="font-medium">{distanza}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-square bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200"
        >
          <Image
            src={magazzino.immagine || "/placeholder.svg"}
            alt={magazzino.nome}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* Right Column - Details */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200/50 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Quantità
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {magazzino.quantity}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  pezzi disponibili
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200/50 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#6033E1] rounded-lg">
                    <Box className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Volume
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {(
                    (magazzino.lunghezza *
                      magazzino.larghezza *
                      magazzino.spessore) /
                    1000000
                  ).toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">m³ per pezzo</div>
              </motion.div>
            </div>

            {/* Dimensions Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="h-5 w-5 text-[#6033E1]" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Dimensioni
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Lunghezza</div>
                  <div className="text-xl font-bold text-gray-900">
                    {magazzino.lunghezza}
                  </div>
                  <div className="text-xs text-gray-500">cm</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Larghezza</div>
                  <div className="text-xl font-bold text-gray-900">
                    {magazzino.larghezza}
                  </div>
                  <div className="text-xs text-gray-500">cm</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Spessore</div>
                  <div className="text-xl font-bold text-gray-900">
                    {magazzino.spessore}
                  </div>
                  <div className="text-xs text-gray-500">cm</div>
                </div>
              </div>
            </div>

            {/* Supplier Info */}
            {utente && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-[#6033E1]" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Fornitore
                  </h3>
                </div>
                <div className="space-y-3">
                  {utente.nomeAzienda && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Building2 className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Azienda</div>
                        <div className="font-semibold text-gray-900">
                          {utente.nomeAzienda}
                        </div>
                      </div>
                    </div>
                  )}
                  {utente.email && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium text-gray-900">
                          {utente.email}
                        </div>
                      </div>
                    </div>
                  )}
                  {utente.telefono && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Phone className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Telefono</div>
                        <div className="font-medium text-gray-900">
                          {utente.telefono}
                        </div>
                      </div>
                    </div>
                  )}
                  {utente.indirizzo && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Indirizzo</div>
                        <div className="font-medium text-gray-900">
                          {utente.indirizzo}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleEmailContact}
                disabled={!utente?.email}
                className="flex-1 bg-[#6033E1] hover:bg-[#4f29b8] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-[#6033E1]/25 hover:shadow-xl hover:shadow-[#6033E1]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Mail className="h-5 w-5" />
                Contatta via Email
              </button>
              <button 
                onClick={handleMapsDirection}
                disabled={!utente?.indirizzo}
                className="px-6 py-3.5 border-2 border-[#6033E1] hover:border-[#4f29b8] text-[#6033E1] hover:text-[#4f29b8] font-semibold rounded-xl transition-all duration-200 hover:bg-[#6033E1]/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Navigation className="h-5 w-5" />
                Indicazioni
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
