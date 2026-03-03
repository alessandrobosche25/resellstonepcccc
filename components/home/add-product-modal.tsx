"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddMarbleScrap from "@/components/addproduct/add";

export function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#6033E1] hover:bg-[#4f29b8] text-white font-semibold rounded-lg transition-colors shadow-sm"
      >
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">Aggiungi Prodotto</span>
        <span className="sm:hidden">Aggiungi</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="min-h-screen px-4 flex items-center justify-center">
                <div className="relative w-full max-w-4xl">
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-12 right-0 h-10 w-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {/* Add Product Form */}
                  <AddMarbleScrap onClose={() => setIsOpen(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
