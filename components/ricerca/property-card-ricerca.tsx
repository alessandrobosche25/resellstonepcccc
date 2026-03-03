"use client";
import { motion } from "framer-motion";
import { Ruler, Building2, MapPin } from "lucide-react";
import { IMagazzino } from "@/types/magazzino";

interface PropertyCardRicercaProps {
  magazzino: IMagazzino;
  onClick: () => void;
  distanza?: number;
  nomeAzienda?: string;
}

export function PropertyCardRicerca({
  magazzino,
  onClick,
  distanza,
  nomeAzienda,
}: PropertyCardRicercaProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative h-full bg-white overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={magazzino.immagine || "/placeholder.png"}
          alt={magazzino.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-gray-700">
          {magazzino.finitura}
        </div>
        {distanza !== undefined && (
          <div className="absolute top-2 right-2 bg-[#6033E1]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-white">
            {distanza.toFixed(1)} km
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-[13px] mb-2 line-clamp-1 text-gray-900">
          {magazzino.nome}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Ruler className="w-3 h-3" />
            <span className="text-[10px]">
              {magazzino.lunghezza} × {magazzino.larghezza} ×{" "}
              {magazzino.spessore} cm
            </span>
          </div>

          {nomeAzienda && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Building2 className="w-3 h-3" />
              <span className="text-[10px] line-clamp-1">{nomeAzienda}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <button className="w-full text-[11px] font-medium text-[#6033E1] hover:text-[#4c28b8] transition-colors flex items-center justify-center gap-1">
            Dettagli
            <span>→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
