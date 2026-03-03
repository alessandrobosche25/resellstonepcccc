"use client"
import { Sidebar } from "@/components/home/sidebar"
import Header from "@/components/home/header"

export default function Help() {
 
  const handleSetSearchQuery = (query: string) => {
  };

  return (
    <div className="min-h-screen bg-white">   
          {/* Header */}
            <Header setSearchQuery={handleSetSearchQuery} />      
          {/* Sidebar */}
            <Sidebar />     
    </div>
  )
}