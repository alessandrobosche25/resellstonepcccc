"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, X, Layers } from "lucide-react"
import type { IMagazzino } from "@/types/magazzino"
import type { IUsers } from "@/types/utente"
import { useAuth } from "@/app/authcontext"

import IconaMail from "@/components/ricerca/iconaMail"
import IconaMaps from "@/components/ricerca/iconaMaps"

interface MagazzinoDetailProps {
  item: IMagazzino
  isUserData: boolean
  dizDistanze: { [key: string]: string }
  dizUtenti: { [key: string]: IUsers }
}

export function MagazzinoDetail({ item, dizDistanze, dizUtenti }: MagazzinoDetailProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  async function eliminaProdotto(id: string) {
    try {
      const res = await fetch("/api/eliminaProdottoFromMagazzino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
      const data = await res.json()
      if (data.success !== false) {
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error("Errore durante il caricamento del magazzino:", error)
    } finally {
      setShowConfirmModal(false)
    }
  }
  const auth = useAuth()
  const { user } = useAuth()

  const [richiestaCreated, setRichiestaCreated] = useState(false)

  useEffect(() => {
    // Supponiamo che un dato "caricato" non sia più "Caricamento..."
    const distanzaCaricata = dizDistanze[item.email] && dizDistanze[item.email] !== "Caricamento..."
    const utenteCaricato = dizUtenti[item.email] && dizUtenti[item.email].nomeAzienda !== "Caricamento..."

    if (!richiestaCreated && distanzaCaricata && utenteCaricato) {
      async function createRichiesta() {
        try {
          // Mapping dei parametri
          const emailMateriale = item.email
          // Qui 'emailUser' potrebbe provenire dalla sessione/autenticazione.
          // Se non si ha la variabile potresti sostituire questo valore con quello corretto.
          const emailUser = user.email
          const nomeMateriale = item.nome
          const distanza = dizDistanze[item.email]
          const misure = `${item.lunghezza} x ${item.larghezza} x ${item.spessore} cm`
          const image = item.immagine
          const finitura = item.finitura

          const body = {
            emailMateriale,
            emailUser,
            nomeMateriale,
            distanza,
            misure,
            image,
            finitura,
          }

          const res = await fetch("/api/createRichiesta", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })

          // Puoi gestire la risposta se necessario
          const data = await res.json()
          console.log("createRichiesta response:", data)
          setRichiestaCreated(true)
        } catch (error) {
          console.error("Errore in createRichiesta:", error)
        }
      }

      //createRichiesta() non so se ha senso che quello che visualizzi recentemente da pc ti compaia dal telefono dato che da pc poi non compare
    }
  }, [dizDistanze, dizUtenti, item.email, richiestaCreated, item])

  return (
    <div className="flex flex-col">
      {/* Parte riguardate limmagine  */}
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={item.immagine || "/placeholder.svg"}
          alt={item.nome}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            {/* Enhanced title with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="relative mb-4"
            >
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-600/30 to-indigo-600/30 blur-lg opacity-70"
                animate={{
                  rotate: [0, 1, 0, -1, 0],
                  scale: [1, 1.02, 1, 1.02, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.h2
                className="text-3xl font-bold relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.1)",
                    "0 0 15px rgba(255,255,255,0.3)",
                    "0 0 5px rgba(255,255,255,0.1)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {item.nome}
              </motion.h2>
            </motion.div>

            {/* Enhanced finitura badge with 3D effect */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-violet-500/50 to-indigo-500/50 blur-sm"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="relative flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 rounded-full shadow-lg z-10">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Layers className="h-4 w-4 text-white/90" />
                  </motion.div>
                  <span className="text-sm font-medium">{item.finitura}</span>
                </div>
              </motion.div>

              {/* Action icons */}
              <div className="flex items-center gap-2">
                <IconaMail selectedMaterial={item} userDetails={dizUtenti} auth={{ user: user }} />
                <IconaMaps selectedMaterial={item} userDetails={dizUtenti} auth={{ user: user }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              {
                label: "Misure",
                value: `${item.lunghezza} cm x ${item.larghezza} cm x ${item.spessore} cm`,
                icon: "ruler",
              },
              {
                label: "Nome Azienda",
                value: dizUtenti[item.email]?.nomeAzienda || "Caricamento...",
                icon: "building",
              },
              { label: "Distanza", value: dizDistanze[item.email] || "Caricamento...", icon: "navigation" },
            ].map((dimension, index) => (
              <motion.div
                key={dimension.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-2">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 bg-violet-100 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      ></motion.div>

                      {dimension.icon === "ruler" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-violet-700 relative z-10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 5v14"></path>
                          <path d="M6 9v6"></path>
                          <path d="M9 5v14"></path>
                          <path d="M12 8v8"></path>
                          <path d="M15 5v14"></path>
                          <path d="M18 9v6"></path>
                          <path d="M21 5v14"></path>
                        </svg>
                      )}

                      {dimension.icon === "building" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-violet-700 relative z-10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 22V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V22M19 22H5M19 22H21M5 22H3M9 7H15M9 11H15M9 15H15"></path>
                        </svg>
                      )}

                      {dimension.icon === "navigation" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-violet-700 relative z-10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2L19 21L12 17L5 21L12 2Z"></path>
                        </svg>
                      )}
                    </div>
                  </div>

                  <motion.p
                    className="text-sm text-gray-500 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {dimension.label}
                  </motion.p>

                  <motion.p
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {dimension.value}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        ></motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute right-4 top-4 text-violet-400 hover:text-violet-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="p-6 flex flex-col items-center">
                <div className="bg-violet-200 p-3 rounded-full mb-4">
                  <AlertTriangle className="h-6 w-6 text-violet-700" />
                </div>

                <h3 className="text-xl font-bold text-center mb-2">
                  Sei sicuro di voler eliminare questo prodotto dal magazzino?
                </h3>
                <p className="text-gray-500 text-center text-sm mb-6">Questa azione non puo' essere annullata.</p>

                <button
                  onClick={() => eliminaProdotto(item._id)}
                  className="w-full bg-[#6033E1] hover:bg-[#7a5ce1] text-white font-medium py-3 rounded-lg mb-2 cursor-pointer"
                >
                  Elimina
                </button>

                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg cursor-pointer"
                >
                  Cancella
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="p-6 flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>

                <h3 className="text-xl font-bold text-center mb-2">Operazione completata</h3>
                <p className="text-gray-500 text-center text-sm mb-6">L'eliminazione e' avvenuta con successo.</p>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg"
                >
                  Fine
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
