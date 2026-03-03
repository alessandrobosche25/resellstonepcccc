"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import MainRicerca from "@/components/ricerca/mainRicerca";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Ricerca() {
  const [searchQuery, setSearchQuery] = useState("");
  const { expanded } = useSidebar();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

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
        <MainRicerca searchQuery={searchQuery} />
      </main>
    </div>
  );
}
