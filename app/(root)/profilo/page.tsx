"use client"
import { Sidebar } from "@/components/home/sidebar"
import Header from "@/components/home/header"
import { useState } from "react";
import CompanyProfile from "@/components/profilo/CompanyProfile";

export default function Profilo() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white">   
      {/* Header */}
      <Header setSearchQuery={setSearchQuery}/>
      {/* Body */}
      <CompanyProfile/> 
      {/* Sidebar */}
      <Sidebar />     
    </div>
  )
}