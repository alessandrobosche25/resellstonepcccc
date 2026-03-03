"use client";
import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import NotificheBody from "@/components/notifiche/NotificheBody";
import { useState } from "react";

export default function Notifiche() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white">
      {/* Header */}
      <Header setSearchQuery={setSearchQuery} />
      <NotificheBody />
      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
