"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type SidebarContextType = {
  expanded: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  const toggleSidebar = () => {
    setExpanded((prev) => !prev)
  }

  return <SidebarContext.Provider value={{ expanded, toggleSidebar }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

