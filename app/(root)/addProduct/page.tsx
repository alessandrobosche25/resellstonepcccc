"use client";
import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import Add from "@/components/addproduct/add";
import { useState } from "react";

export default function AddProduct() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <Header setSearchQuery={setSearchQuery} />

      <Add />

      {/* Sidebar */}

      <Sidebar />
    </div>
  );
}
