"use client"

import type { IUsers } from "@/types/utente"
import type React from "react"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

interface Material {
  email?: string
}

interface UserDetails {
  [key: string]: IUsers
}

interface AuthUser {
  indirizzo?: string
}

interface IconaMapsProps {
  selectedMaterial?: Material | null
  userDetails: UserDetails
  auth: { user?: AuthUser }
}

const IconaMaps: React.FC<IconaMapsProps> = ({ selectedMaterial, userDetails, auth }) => {
  // Verifica se userDetails è popolato (almeno una chiave)
  const isUserDetailsLoaded = Object.keys(userDetails).length > 0

  // Otteniamo l'indirizzo di destinazione dal dizionario userDetails se disponibile
  const destination =
    selectedMaterial?.email && userDetails[selectedMaterial.email]
      ? userDetails[selectedMaterial.email].indirizzo || ""
      : ""
  const origin = auth.user?.indirizzo || ""

  const mapsLink =
    selectedMaterial && destination
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          origin
        )}&destination=${encodeURIComponent(destination)}`
      : "#"

  // Funzione per renderizzare il contenuto interno dell'icona (animazioni, icona, effetto 3D)
  const renderIconContent = () => (
    <>
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 opacity-0 group-hover:opacity-100"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 bg-white rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{
          scale: [0, 1.2, 1.5],
          opacity: [0, 0.3, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "loop",
          },
        }}
      />

      {/* Icon with bounce animation */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <MapPin className="text-white w-5 h-5" />
      </motion.div>

      {/* 3D shadow effect */}
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm rounded-full transform skew-x-12"></div>
    </>
  )

  // Se i dettagli utente non sono ancora caricati o destination non è disponibile,
  // rendiamo l'icona non cliccabile con aspetto grigio (e hover invariato)
  if (!isUserDetailsLoaded || !destination) {
    return (
      <motion.div
        className="inline-block ml-2"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
      >
        <motion.div
          className="relative flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full shadow-lg group overflow-hidden cursor-not-allowed"
        >
          {renderIconContent()}
        </motion.div>
      </motion.div>
    )
  }

  // Altrimenti, l'icona è cliccabile e mantiene gli stili originali (viola) con gli effetti hover
  return (
    <motion.div
      className="inline-block ml-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full shadow-lg group overflow-hidden"
        whileHover={{ boxShadow: "0 8px 20px rgba(96, 51, 225, 0.3)" }}
      >
        {renderIconContent()}
      </motion.a>
    </motion.div>
  )
}

export default IconaMaps
