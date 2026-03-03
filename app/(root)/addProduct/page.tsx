"use client";

import { Sidebar } from "@/components/home/sidebar";
import Header from "@/components/home/header";
import { useSidebar } from "@/components/home/sidebar-context";
import { cn } from "@/lib/utils";
import Add from "@/components/addproduct/add";

export default function AddProduct() {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          expanded ? "ml-64" : "ml-[72px]"
        )}
      >
        <Add />
      </main>
    </div>
  );
}
