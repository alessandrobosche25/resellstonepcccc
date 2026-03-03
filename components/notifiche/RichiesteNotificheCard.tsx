"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import clsx from "clsx"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, RefreshCw, X } from "lucide-react"

interface NotificheCardProps {
  notifiche: {
    id: string
    email: string
    nomeMateriale: string
    tempo: string
    finitura: string
    isRead: boolean
    daysPassed: number
    hourPassed: number
    minutesPassed: number
  }[]
  onRemove: (id: string) => void
  onRemoveOldNotifications: (ids: string[], nomi: string[]) => void
  onUpdateScadenza: (id: string) => void
}

const getBorderColorClass = (days: number) => {
  if (days === 0) {
    return "border-green-500"
  } else if (days >= 1 && days <= 5) {
    return "border-green-500"
  } else if (days >= 6 && days <= 10) {
    return "border-yellow-500"
  } else if (days >= 15) {
    return "border-red-500"
  } else {
    return "border-gray-300"
  }
}

const getStatusInfo = (days: number) => {
  if (days === 0) {
    return { color: "bg-green-100 text-green-800", text: "Nuovo" }
  } else if (days >= 1 && days <= 5) {
    return { color: "bg-green-100 text-green-800", text: "Recente" }
  } else if (days >= 6 && days <= 10) {
    return { color: "bg-yellow-100 text-yellow-800", text: "In scadenza" }
  } else if (days >= 15) {
    return { color: "bg-red-100 text-red-800", text: "Scaduto" }
  } else {
    return { color: "bg-gray-100 text-gray-800", text: "Attivo" }
  }
}

const NotificheCard: React.FC<NotificheCardProps> = ({
  notifiche,
  onRemove,
  onRemoveOldNotifications,
  onUpdateScadenza,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [resetNotifiche, setResetNotifiche] = useState<{ [key: string]: number }>({})

  const hasCalledRemovalRef = useRef(false)

  useEffect(() => {
    if (hasCalledRemovalRef.current) return

    const oldNotifications = notifiche.filter((n) => n.daysPassed >= 16)
    if (oldNotifications.length > 0) {
      const oldIds = oldNotifications.map((n) => n.id)
      const oldNames = oldNotifications.map((n) => n.nomeMateriale)
      onRemoveOldNotifications(oldIds, oldNames)
      hasCalledRemovalRef.current = true
    }
  }, [notifiche, onRemoveOldNotifications])

  return (
    <div className="relative px-1 py-2">
      <AnimatePresence>
        {notifiche.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Clock className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium">Nessuna ricerca attiva</p>
          </div>
        ) : (
          notifiche.map((notifica) => {
            const isDragging = draggingId === notifica.id
            const shouldHighlight = isDragging && (dragOffset > 100 || dragOffset < -100)
            const daysPassed = resetNotifiche[notifica.id] ?? notifica.daysPassed
            const hourPassed = resetNotifiche[notifica.id] ?? notifica.hourPassed
            const minutesPassed = resetNotifiche[notifica.id] ?? notifica.minutesPassed
            const borderColorClass = shouldHighlight ? "border-red-500" : getBorderColorClass(daysPassed)
            const status = getStatusInfo(daysPassed)

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
                initial={{ opacity: 0, y: 10 }}
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
                    <div className="flex items-center text-red-500 font-medium">
                      <X className="w-4 h-4 mr-1" />
                      <span>{dragOffset < 0 ? "Rimuovi" : "Rimuovi"}</span>
                    </div>
                  </div>
                )}

                <motion.div
                  className={clsx(
                    "relative bg-white rounded-xl p-5 border shadow-sm transition-all duration-200",
                    borderColorClass,
                    {
                      "border-2": isDragging,
                      border: !isDragging,
                      "shadow-lg shadow-red-100": shouldHighlight,
                      "hover:shadow-md": !isDragging,
                    },
                  )}
                  style={{
                    boxShadow: shouldHighlight
                      ? "0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -4px rgba(239, 68, 68, 0.2)"
                      : undefined,
                  }}
                  whileHover={{ y: -2 }}
                  whileDrag={{ scale: 1.02 }}
                >
                  {/* Status badge */}
                  <div className="absolute top-5 right-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <div className="pr-20">
                    <div className="font-bold text-gray-900 mb-2 text-base">{notifica.nomeMateriale}</div>

                    {notifica.finitura && notifica.finitura !== "" && (
                      <div className="text-sm text-gray-600 mb-3">
                        Finitura: <span className="font-medium">{notifica.finitura}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mb-1">{notifica.tempo}</div>

                    <div className="flex items-center text-xs font-medium">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      <span className={daysPassed >= 10 ? "text-red-500" : "text-gray-500"}>
                        {daysPassed > 0
                          ? `${daysPassed} ${daysPassed === 1 ? "giorno" : "giorni"} e ${hourPassed % 24} ${
                              hourPassed % 24 === 1 ? "ora" : "ore"
                            } fa`
                          : hourPassed > 0
                            ? `${hourPassed} ${hourPassed === 1 ? "ora" : "ore"} fa`
                            : minutesPassed > 0
                              ? `${minutesPassed} ${minutesPassed === 1 ? "minuto" : "minuti"} fa`
                              : "Appena adesso"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setResetNotifiche((prev) => ({ ...prev, [notifica.id]: 0 }))
                      onUpdateScadenza(notifica.id)
                    }}
                    className="absolute bottom-5 cursor-pointer right-5 px-3 py-1.5 text-xs font-medium text-[#6033E1] bg-white border border-[#6033E1] rounded-lg hover:bg-[#6033E1] hover:text-white transition-all duration-200 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ripristina</span>
                  </button>
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
