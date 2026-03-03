"use client";
import Image from "next/image";
import { Ruler } from "lucide-react";
import { motion } from "framer-motion";
import type { IMagazzino } from "@/types/magazzino";
import { IUsers } from "@/types/utente";

interface PropertyCardProps {
  magazzino: IMagazzino;
  onSelect: (item: IMagazzino) => void;
  dizDistanze: { [key: string]: string };
  dizUtenti: { [key: string]: IUsers };
}

export function PropertyCard({
  magazzino,
  onSelect,
  dizDistanze,
  dizUtenti,
}: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-gray-300 overflow-hidden transition-all h-full flex flex-col"
      onClick={() => onSelect(magazzino)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={magazzino.immagine || "/placeholder.svg"}
          alt={magazzino.nome}
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] font-medium rounded">
            {magazzino.finitura === "0" ? "N/A" : magazzino.finitura}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-2 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          {magazzino.nome}
        </h3>

        {/* Dimensions */}
        <div className="flex items-center gap-1.5">
          <Ruler className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <div className="text-[10px] text-gray-600 truncate">
            {magazzino.lunghezza}×{magazzino.larghezza}×{magazzino.spessore} cm
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <button className="text-[11px] text-[#6033E1] hover:text-[#4f29b8] font-medium transition-colors">
            Dettagli →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
