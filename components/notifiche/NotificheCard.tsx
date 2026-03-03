"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Bell } from "lucide-react"

interface NotificheCardProps {
  className?: string
  notifiche: {
    id: string // Identificativo univoco
    azienda: string
    text: string
    tempo: string
    image: string
    link: string
    isRead: boolean
  }[]
  onRemove: (id: string) => void // Callback per rimuovere per ID
}




const NotificheCard: React.FC<NotificheCardProps> = ({ className, notifiche, onRemove }) => {

  function getQueryParam(url: any, param: any) {
    // Se "url" non è un URL completo, puoi aggiungere un dominio fittizio per creare l'oggetto URL
    const fullUrl = url.startsWith('http') ? url : `http://dummy${url}`;
    const urlObj = new URL(fullUrl);
    return urlObj.searchParams.get(param);
  }

  const [draggingId, setDraggingId] = useState<string | null>(null) // ID della card in trascinamento
  const [dragOffset, setDragOffset] = useState<number>(0) // Traccia la distanza di trascinamento

  return (
    <div
      className={`${className} px-2`}
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        height: "calc(-300px + 100vh)",
        overflowY: "auto",
      }}
    >
      <AnimatePresence>
        {notifiche.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Bell className="w-10 h-10 mb-2 opacity-50" />
            <p>Nessuna notifica</p>
          </div>
        ) : (
          notifiche.map((notifica) => {
            const isDragging = draggingId === notifica.id
            const deleteThreshold = dragOffset > 100 || dragOffset < -100

            return (
              <motion.div
                key={notifica.id}
                className={`relative mb-4 ${isDragging ? "z-20" : "z-0"}`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragStart={() => {
                  setDraggingId(notifica.id)
                  setDragOffset(0)
                }}
                onDrag={(event, info) => setDragOffset(info.offset.x)}
                onDragEnd={(event, info) => {
                  setDraggingId(null)
                  setDragOffset(0)
                  if (info.offset.x > 100 || info.offset.x < -100) {
                    onRemove(notifica.id)
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ duration: 0.3 }}
              >
                {/* Swipe indicator */}
                {isDragging && (
                  <div
                    className="absolute inset-0 flex items-center justify-end px-4 pointer-events-none"
                    style={{ opacity: Math.min(Math.abs(dragOffset) / 100, 1) }}
                  >
                    <div className="text-red-500 font-medium">{dragOffset < 0 ? "← Rimuovi" : "Rimuovi →"}</div>
                  </div>
                )}

                {/* Card */}
                <motion.div
                  className={`relative flex items-center bg-white rounded-xl p-4 w-full border transition-all duration-200 ${
                    notifica.isRead ? "bg-white" : "bg-purple-50"
                  }`}
                  style={{
                    borderColor:
                      isDragging && deleteThreshold ? "rgb(239, 68, 68)" : notifica.isRead ? "#e5e7eb" : "#d8b4fe",
                    borderWidth: isDragging ? "2px" : "1px",
                    boxShadow:
                      isDragging && deleteThreshold
                        ? "0 8px 20px rgba(239, 68, 68, 0.3)"
                        : isDragging
                          ? "0 8px 16px rgba(0, 0, 0, 0.12)"
                          : "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  whileHover={{ y: -2, boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)" }}
                  whileDrag={{ scale: 1.02 }}
                >
                  {!notifica.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-purple-500 rounded-r-full" />
                  )}

                  <div className="relative mr-4">
                    <div
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 ${notifica.isRead ? "border-gray-100" : "border-purple-200"}`}
                    >
                      <img
                        src={notifica.image || "/placeholder-image.png"}
                        alt={notifica.azienda || "Notifica"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 pr-2">
                    <div className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">{notifica.text}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span>{notifica.tempo}</span>
                      {notifica.azienda && (
                        <>
                          <span className="mx-1.5">•</span>
                          <span className="font-medium text-gray-600">{notifica.azienda}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link
  // Estrai il parametro 'query' dalla stringa notifica.link
  href={`/ricerca?query=${getQueryParam(notifica.link, 'query')}`} // sta roba pernde il parametro query dalla stringa di resellstone normale cosi lo passa all'url della ricerca che ce qua
  rel="noopener noreferrer"
  onClick={() => {
    // Puoi aggiungere la logica che desideri qui
    console.log("Parametro query:", getQueryParam(notifica.link, 'query'));
  }}
  className="flex items-center gap-1 text-[#6033E1] bg-white border border-[#6033E1] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#6033E1] hover:text-white transition-all group"
>
  <span>Vedi</span>
  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
</Link>
                </motion.div>
              </motion.div>
            )
          })
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificheCard
