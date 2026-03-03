"use client"
import { Sidebar } from "@/components/home/sidebar"
import Header from "@/components/home/header"
import MainRicerca from "@/components/ricerca/mainRicerca"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get the query parameter from URL when component mounts or URL changes
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <Header setSearchQuery={setSearchQuery}/>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Se volete provare a vedere come viene decommentate quello sotto */}
       <MainRicerca searchQuery={searchQuery} /> 
      
    </div>
  )
}
