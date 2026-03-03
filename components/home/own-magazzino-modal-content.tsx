"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import {
  Ruler,
  Package,
  Box,
  CheckCircle,
  AlertTriangle,
  X,
  Upload,
  Edit,
  Trash2,
} from "lucide-react";
import type { IMagazzino } from "@/types/magazzino";
import { mutate } from "swr";
import { useAuth } from "@/app/authcontext";

interface OwnMagazzinoModalContentProps {
  magazzino: IMagazzino;
  onClose: () => void;
}

export function OwnMagazzinoModalContent({
  magazzino,
  onClose,
}: OwnMagazzinoModalContentProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<IMagazzino>({ ...magazzino });
  const [imagePreview, setImagePreview] = useState<string | null>(
    magazzino.immagine || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  async function eliminaProdotto(id: string) {
    try {
      const res = await fetch("/api/eliminaProdottoFromMagazzino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      if (data.success !== false) {
        setShowSuccessModal(true);
        mutate([`/api/getMagazzinoByEmail`, user?.email]);
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione del prodotto:", error);
    } finally {
      setShowConfirmModal(false);
    }
  }

  async function aggiornaProdotto() {
    try {
      const prodottoToUpdate = {
        id: editedItem._id,
        finitura: editedItem.finitura,
        nome: editedItem.nome,
        lunghezza: editedItem.lunghezza,
        larghezza: editedItem.larghezza,
        spessore: editedItem.spessore,
        immagine: imagePreview,
        quantity: editedItem.quantity,
      };

      const res = await fetch("/api/updateMagazzinoProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prodottoToUpdate),
      });
      const data = await res.json();
      if (data.success !== false) {
        setShowSuccessModal(true);
        mutate([`/api/getMagazzinoByEmail`, user?.email]);
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento del prodotto:", error);
    } finally {
      setIsEditing(false);
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]:
        name === "lunghezza" ||
        name === "larghezza" ||
        name === "spessore" ||
        name === "quantity"
          ? Number.parseFloat(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
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
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Prodotto
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={editedItem.nome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6033E1] focus:ring-2 focus:ring-[#6033E1]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Finitura
                      </label>
                      <select
                        name="finitura"
                        value={editedItem.finitura}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6033E1] focus:ring-2 focus:ring-[#6033E1]/20 outline-none transition-all"
                      >
                        <option value="grezzo">Grezzo</option>
                        <option value="bocciardato">Bocciardato</option>
                        <option value="fiammato">Fiammato</option>
                        <option value="lucido">Lucido</option>
                        <option value="spazzolato">Spazzolato</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {magazzino.nome}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-gray-200 font-medium">
                        {magazzino.finitura === "0"
                          ? "N/A"
                          : magazzino.finitura}
                      </span>
                    </div>
                  </>
                )}
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
            {isEditing ? (
              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Anteprima"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-6 right-6 bg-[#6033E1] hover:bg-[#4f29b8] text-white p-4 rounded-full shadow-lg transition-all"
                    >
                      <Upload className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#6033E1] transition-all"
                  >
                    <Upload className="mb-4 text-gray-400" size={48} />
                    <div className="text-lg font-medium text-gray-500">
                      Clicca per caricare un'immagine
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      PNG, JPG fino a 10MB
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Image
                src={magazzino.immagine || "/placeholder.svg"}
                alt={magazzino.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </motion.div>

          {/* Right Column - Details */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {isEditing ? (
                <>
                  {/* Edit Mode - Dimensions */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Ruler className="h-5 w-5 text-[#6033E1]" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dimensioni e Quantità
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lunghezza (cm)
                        </label>
                        <input
                          type="number"
                          name="lunghezza"
                          value={editedItem.lunghezza}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#6033E1] focus:ring-2 focus:ring-[#6033E1]/20 outline-none"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Larghezza (cm)
                        </label>
                        <input
                          type="number"
                          name="larghezza"
                          value={editedItem.larghezza}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#6033E1] focus:ring-2 focus:ring-[#6033E1]/20 outline-none"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Spessore (cm)
                        </label>
                        <input
                          type="number"
                          name="spessore"
                          value={editedItem.spessore}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#6033E1] focus:ring-2 focus:ring-[#6033E1]/20 outline-none"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantità
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={editedItem.quantity}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#6033E1] focus:ring-2 focus:ring-[#6033E1]/20 outline-none"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Edit Mode */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={aggiornaProdotto}
                      className="flex-1 bg-[#6033E1] hover:bg-[#4f29b8] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-[#6033E1]/25 hover:shadow-xl hover:shadow-[#6033E1]/30"
                    >
                      Salva Modifiche
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedItem({ ...magazzino });
                        setImagePreview(magazzino.immagine || null);
                      }}
                      className="px-6 py-3.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:bg-gray-50"
                    >
                      Annulla
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode - Stats Grid */}
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
                      <div className="text-xs text-gray-600 mt-1">
                        m³ per pezzo
                      </div>
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
                        <div className="text-sm text-gray-600 mb-1">
                          Lunghezza
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {magazzino.lunghezza}
                        </div>
                        <div className="text-xs text-gray-500">cm</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Larghezza
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {magazzino.larghezza}
                        </div>
                        <div className="text-xs text-gray-500">cm</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Spessore
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {magazzino.spessore}
                        </div>
                        <div className="text-xs text-gray-500">cm</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - View Mode */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-[#6033E1] hover:bg-[#4f29b8] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-[#6033E1]/25 hover:shadow-xl hover:shadow-[#6033E1]/30 flex items-center justify-center gap-2"
                    >
                      <Edit className="h-5 w-5" />
                      Modifica
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="px-6 py-3.5 border-2 border-red-300 hover:border-red-400 text-red-600 font-semibold rounded-xl transition-all duration-200 hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      Elimina
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
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
                  Conferma Eliminazione
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 text-center text-sm mb-6"
                >
                  Sei sicuro di voler eliminare questo prodotto? Questa azione
                  non può essere annullata.
                </motion.p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => eliminaProdotto(magazzino._id)}
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
                    Annulla
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-2xl relative overflow-hidden"
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
                  Operazione Completata
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 text-center text-sm mb-6"
                >
                  L'operazione è stata eseguita con successo.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-[#6033E1] to-indigo-600 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Chiudi
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
