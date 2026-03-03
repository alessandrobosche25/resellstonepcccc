"use client";
import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import Main from "@/components/home/main";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header setSearchQuery={setSearchQuery} />

      {/* Sidebar */}
      <Sidebar />

      {/* Se volete provare a vedere come viene decommentate quello sotto */}
      <Main searchQuery={searchQuery} />
    </div>
  );
}
