"use client";
import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import Main from "@/components/home/main";
import { useSidebar } from "@/components/home/sidebar-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header setSearchQuery={setSearchQuery} />
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          expanded ? "ml-64" : "ml-[72px]"
        )}
      >
        <Main searchQuery={searchQuery} />
      </main>
    </div>
  );
}
