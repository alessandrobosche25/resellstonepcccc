"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import Search from "@/components/home/search-component";
import { useAuth } from "@/app/authcontext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) {
  const auth = useAuth();
  const [notificationCount] = useState(3);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NexLink Style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/resellstoneLOGO.svg"
                  alt="ResellStone"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Search - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-xl mx-12">
              <Search setSearchQuery={setSearchQuery} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Notification button */}
              <Link href="/notifiche">
                <button className="relative p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  <Bell className="h-5 w-5 text-gray-700" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-semibold items-center justify-center">
                        {notificationCount}
                      </span>
                    </span>
                  )}
                </button>
              </Link>

              {/* Profile button with dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                    <Image
                      src={auth?.user?.fileBase64 || "/img/default-avatar.png"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {auth?.user?.nomeAzienda || "Azienda"}
                    </p>
                    <p className="text-xs text-gray-500">Account</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl border-2 border-gray-200 shadow-xl z-50"
                    >
                      {/* Header */}
                      <div className="p-4 border-b-2 border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={
                                auth?.user?.fileBase64 ||
                                "/img/default-avatar.png"
                              }
                              alt="Profile"
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 truncate">
                              {auth?.user?.nomeAzienda || "Azienda"}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {auth?.user?.nome || "Nome"}{" "}
                              {auth?.user?.cognome || "Cognome"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Indirizzo
                            </p>
                            <p className="text-sm text-gray-900 mt-1">
                              {auth?.user?.indirizzo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Telefono
                            </p>
                            <p className="text-sm text-gray-900 mt-1">
                              {auth?.user?.telefono || "Non disponibile"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Email
                            </p>
                            <p className="text-sm text-gray-900 mt-1 truncate">
                              {auth?.user?.email || "Non disponibile"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-4 border-t-2 border-gray-200">
                        <Link
                          href="/profilo"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <button className="w-full px-4 py-2.5 bg-[#6033E1] hover:bg-[#4f29b8] text-white font-semibold rounded-lg transition-colors">
                            Vai al Profilo
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3 border-t border-gray-200 mt-3 pt-3">
            <Search setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}
