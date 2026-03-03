"use client"

import type { IUsers } from "@/types/utente"
import type React from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

interface Material {
  nome?: string
  finitura?: string
  lunghezza?: number
  larghezza?: number
  spessore?: number
  email?: string
}

interface UserDetails {
  [key: string]: IUsers
}

interface AuthUser {
  nomeAzienda?: string
  indirizzo?: string
  email?: string
}

interface IconaMailProps {
  selectedMaterial?: Material | null
  userDetails: UserDetails
  auth: { user?: AuthUser }
}

const IconaMail: React.FC<IconaMailProps> = ({ selectedMaterial, userDetails, auth }) => {
  // Verifica se userDetails è popolato (almeno una chiave)
  const isUserDetailsLoaded = Object.keys(userDetails).length > 0

  // Se selectedMaterial.email è definito, cerchiamo l'utente in userDetails
  const recipientEmail = selectedMaterial?.email ? userDetails[selectedMaterial.email]?.email : ""

  // Creiamo il mailtoLink solo se abbiamo un indirizzo email
  const mailtoLink = `mailto:${recipientEmail}?subject=Richiesta%20di%20informazioni&body=Salve vorrei avere maggiori informazioni su ${
    selectedMaterial?.nome
  } con finitura ${selectedMaterial?.finitura} e dimensioni ${
    selectedMaterial?.lunghezza
  }x${selectedMaterial?.larghezza}x${
    selectedMaterial?.spessore
  }cm. Nome azienda: ${auth.user?.nomeAzienda}, Indirizzo: ${auth.user?.indirizzo}, Email: ${auth.user?.email}.`

  // Funzione per rendere il contenuto dell'icona, riutilizzata sia per il link attivo sia per la versione disabilitata
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

      {/* Icon */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -2, 0],
          rotateZ: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Mail className="text-white w-5 h-5" />
      </motion.div>

      {/* 3D shadow effect */}
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/20 blur-sm rounded-full transform skew-x-12"></div>
    </>
  )

  return (
    <motion.div
      className="inline-block ml-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.2,
      }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {isUserDetailsLoaded && recipientEmail ? (
        // Se userDetails è caricato, rendiamo il link cliccabile
        <motion.a
          href={mailtoLink}
          className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full shadow-lg group overflow-hidden"
          whileHover={{
            boxShadow: "0 8px 20px rgba(96, 51, 225, 0.3)",
          }}
        >
          {renderIconContent()}
        </motion.a>
      ) : (
        // Altrimenti, rendi l'icona non cliccabile
        <motion.div
          className="relative flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full shadow-lg group overflow-hidden cursor-not-allowed"
        >
          {renderIconContent()}
        </motion.div>
      )}
    </motion.div>
  )
}

export default IconaMail
