"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SearchComponent({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [recentSearches] = useState(["Marmo", "Legno", "Ceramica", "Vetro"]);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close modal when ESC is pressed
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.key === "Enter" && isOpen && inputValue) {
        handleSearch();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, inputValue]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Start search
  const handleSearch = () => {
    if (inputValue.trim()) {
      setIsOpen(false);
      router.push(`/ricerca?query=${encodeURIComponent(inputValue)}`);
    }
  };

  // Handle recent search click
  const handleRecentSearch = (term: string) => {
    setInputValue(term);
    setSearchQuery(term);
    setIsOpen(false);
  };

  return (
    <>
      {/* NexLink style search bar */}
      <div className="relative w-full">
        <div
          className="relative cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg py-2.5 pl-12 pr-4 hover:border-gray-300 hover:bg-white transition-all">
            <span className="text-sm text-gray-600 font-medium">
              Cerca materiali...
            </span>
          </div>
        </div>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal - NexLink Style */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] z-50"
            >
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-2xl overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900">
                      Cerca Materiali
                    </h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search input */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Cerca materiale..."
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg py-3.5 pl-12 pr-28 text-sm font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6033E1] focus:border-[#6033E1] transition-all"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6033E1] hover:bg-[#4f29b8] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                    >
                      Cerca
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
