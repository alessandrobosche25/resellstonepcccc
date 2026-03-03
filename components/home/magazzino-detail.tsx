"use client"

import type React from "react"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { CheckCircle, AlertTriangle, X, Upload } from "lucide-react"
import type { IMagazzino } from "@/types/magazzino"
import { mutate } from "swr"
import { useAuth } from "@/app/authcontext"

interface MagazzinoDetailProps {
  item: IMagazzino
  onClose: () => void
}

export function MagazzinoDetail({ item, onClose }: MagazzinoDetailProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<IMagazzino>({ ...item })
  const [imagePreview, setImagePreview] = useState<string | null>(item.immagine || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

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
        mutate([`/api/getMagazzinoByEmail`, user?.email])
      }
    } catch (error) {
      console.error("Errore durante il caricamento del magazzino:", error)
    } finally {
      setShowConfirmModal(false)
    }
  }

  async function aggiornaProdotto() {
    try {
      // Create a new object with the exact properties in the specified order
      const prodottoToUpdate = {
        id: editedItem._id, // Assuming _id is the ID field
        finitura: editedItem.finitura,
        nome: editedItem.nome,
        lunghezza: editedItem.lunghezza,
        larghezza: editedItem.larghezza,
        spessore: editedItem.spessore,
        immagine: imagePreview, // This should already be base64 from handleImageChange
        quantity: editedItem.quantity,
      }

      const res = await fetch("/api/updateMagazzinoProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prodottoToUpdate), // Send the object directly, not wrapped in { prodotto: ... }
      })
      const data = await res.json()
      if (data.success !== false) {
        // Update the item state with the edited values before showing success modal
        item = { ...editedItem, immagine: imagePreview || "/placeholder.svg" }
        setShowSuccessModal(true)
        mutate([`/api/getMagazzinoByEmail`, user?.email])
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento del prodotto:", error)
    } finally {
      setIsEditing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedItem((prev) => ({
      ...prev,
      [name]: name === "lunghezza" || name === "larghezza" || name === "spessore" || name === "quantity" ? Number.parseFloat(value) : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImagePreview(base64String)
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col">
      {/* Parte riguardate limmagine - reduced height with aspect-[16/9] */}
      <div className="relative w-full aspect-[16/9]">
        {isEditing ? (
          <div className="w-full h-[80%] bg-gray-100 flex flex-col items-center justify-center p-4">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

            {imagePreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Anteprima"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Upload className="text-gray-700" size={20} />
                </button>
              </div>
            ) : (
              <div
                onClick={triggerFileInput}
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Upload className="mb-2 text-gray-400" size={32} />
                <div className="text-sm text-gray-500">Clicca per caricare un'immagine</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Image
              src={item.immagine || "/placeholder.svg"}
              alt={item.nome}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mb-2"
                >
                  {item.nome}
                </motion.h2>
                
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6 mt-[-70px]">
        {isEditing ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={editedItem.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Finitura</label>
                <select
                  name="finitura"
                  value={editedItem.finitura}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="grezzo">Grezzo</option>
                  <option value="bocciardato">Bocciardato</option>
                  <option value="fiammato">Fiammato</option>
                  <option value="lucido">Lucido</option>
                  <option value="spazzolato">Spazzolato</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Dimensioni</h3>
                <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Lunghezza (cm)</label>
                  <input
                  type="number"
                  name="lunghezza"
                  value={editedItem.lunghezza.toString()}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  step="0.1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Larghezza (cm)</label>
                  <input
                  type="number"
                  name="larghezza"
                  value={editedItem.larghezza}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  step="0.1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Spessore (cm)</label>
                  <input
                    type="number"
                    name="spessore"
                    value={editedItem.spessore}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Quantità</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editedItem.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    step="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={aggiornaProdotto}
                className="px-4 py-2 bg-[#6033E1] hover:bg-[#7a5ce1] transition-all duration-200 rounded-lg text-white font-medium flex-1 cursor-pointer"
              >
                Conferma
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedItem({ ...item }) // Reset to original values
                  setImagePreview(item.immagine || null) // Reset image preview
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 rounded-lg text-gray-800 font-medium flex-1 cursor-pointer"
              >
                Annulla
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <h3 className="text-xl font-semibold mb-3">Dimensioni</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Misure", value: `${item.lunghezza} cm x ${item.larghezza} cm x ${item.spessore} cm`, icon: "ruler" },
                  { label: "Quantità", value: item.quantity ? item.quantity : 1, icon: "width" },
                  { label: "Finitura", value: `${item.finitura}` , icon: "layers" },
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

                          {dimension.icon === "width" && (
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
                              <path d="M21 6H3"></path>
                              <path d="M21 12H3"></path>
                              <path d="M21 18H3"></path>
                            </svg>
                          )}

                          {dimension.icon === "layers" && (
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
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="M2 17l10 5 10-5"></path>
                              <path d="M2 12l10 5 10-5"></path>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold mb-3">Azioni</h3>
              <div className="flex gap-4">
                <motion.button
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-medium cursor-pointer shadow-md relative overflow-hidden group"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                    Modifica
                  </div>
                </motion.button>

                <motion.button
                  className="flex-1 py-3 px-4 bg-white border border-red-200 rounded-xl text-red-500 font-medium cursor-pointer shadow-sm relative overflow-hidden group"
                  onClick={() => setShowConfirmModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                    Elimina
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400"></div>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-6 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="relative mb-4"
                >
                  <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
                  <div className="bg-red-100 p-4 rounded-full relative z-10">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-center mb-2"
                >
                  Sei sicuro di voler eliminare questo prodotto dal magazzino?
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 text-center text-sm mb-6"
                >
                  Questa azione non può essere annullata.
                </motion.p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => eliminaProdotto(item._id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Elimina
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancella
                  </motion.button>
                </div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-6 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="relative mb-4"
                >
                  <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
                  <div className="bg-green-100 p-4 rounded-full relative z-10">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-center mb-2"
                >
                  Operazione completata
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 text-center text-sm mb-6"
                >
                  L'operazione è avvenuta con successo.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Fine
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
