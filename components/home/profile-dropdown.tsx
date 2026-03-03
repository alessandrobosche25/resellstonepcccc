"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { LogOut, User, Settings, Package, CreditCard } from "lucide-react"

interface UserProfile {
  nomeAzienda: string
  email: string
  indirizzo: string
  telefono: string
  fileBase64: string
  hasAccess: boolean
  TourSeen: boolean
}

export default function ProfileDropdown({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Only fetch data when dropdown is opened
    if (isOpen && !userData && userEmail) {
        console.log(userEmail)
      fetchUserData()
    }
  }, [isOpen, userEmail])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/getUtentiByEmaill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      })

      if (!response.ok) throw new Error("Failed to fetch profile data")

      const data = await response.json()
      console.log("susgsajhsaj"+data)
      // Since getUtenteByEmail returns an array, we take the first item
      setUserData(Array.isArray(data) && data.length > 0 ? data[0] : data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const profileImage = userData?.fileBase64 || "/resellstoneLOGO.svg"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6033E1] focus:ring-offset-2"
      >
        {userData?.fileBase64 ? (
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <Image src="/resellstoneLOGO.svg" alt="Profile" width={34} height={25} className="object-cover" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out">
          <div className="p-4 border-b border-gray-100">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#6033E1] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userData ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-[#6033E1]/10 flex items-center justify-center">
                    {userData.fileBase64 ? (
                      <Image
                        src={userData.fileBase64 || "/placeholder.svg"}
                        alt={userData.nomeAzienda}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-[#6033E1]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{userData.nomeAzienda}</h3>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 w-20">Indirizzo:</span>
                    <span className="text-xs text-gray-700">{userData.indirizzo}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 w-20">Telefono:</span>
                    <span className="text-xs text-gray-700">{userData.telefono}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 w-20">Abbonamento:</span>
                    <span className={`text-xs ${userData.hasAccess ? "text-green-600" : "text-red-600"}`}>
                      {userData.hasAccess ? "Attivo" : "Non attivo"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">Nessun dato disponibile</p>
            )}
          </div>

          <div className="bg-gray-50">
            <Link
              href="/profilo"
              className="flex items-center px-4 py-3 text-sm  text-violet-400 hover:text-violet-700 transition-colors"
            >
              <User className="h-4 w-4 mr-3 text-[#6033E1]" />
              Profilo completo
            </Link>
            <Link
              href="/magazzino"
              className="flex items-center px-4 py-3 text-sm text-violet-400 hover:text-violet-700 transition-colors"
            >
              <Package className="h-4 w-4 mr-3 text-[#6033E1]" />
              Magazzino
            </Link>
            <Link
              href="/logout"
              className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-colors border-t border-gray-200"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-600" />
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
