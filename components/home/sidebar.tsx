"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Home,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Hexagon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSVGV from "../shared/loading/LoadingSVGV";
import { useAuth } from "@/app/authcontext";
import Image from "next/image";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const dashboardItems: NavItem[] = [
  {
    href: "/home",
    icon: Home,
    label: "Magazzino",
  },
  {
    href: "/addProduct",
    icon: Plus,
    label: "Aggiungi",
  },
  {
    href: "/notifiche",
    icon: Bell,
    label: "Notifiche",
  },
];

const adminItems: NavItem[] = [
  {
    href: "/profilo",
    icon: User,
    label: "Profilo",
  },
];

const footerItems: NavItem[] = [
  {
    href: "#",
    icon: LogOut,
    label: "Esci",
  },
];

export function Sidebar() {
  const { expanded, toggleSidebar } = useSidebar();
  const [isL_out, setIsL_out] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      setIsL_out(true);
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      if (response.ok) {
        setIsL_out(false);
        const data = await response.json();
        console.log("Logout successful:", data);
        router.push("/");
      } else {
        setIsL_out(false);
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const NavLink = ({
    item,
    index,
    section,
  }: {
    item: NavItem;
    index: number;
    section: string;
  }) => {
    const isActive = pathname === item.href;

    return (
      <li>
        <Link
          href={item.href}
          onClick={item.label === "Esci" ? handleLogout : undefined}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all relative group",
            expanded ? "mx-3" : "mx-3 justify-center",
            isActive
              ? "bg-[#6033E1] text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
          title={!expanded ? item.label : undefined}
        >
          {isActive && expanded && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#6033E1] rounded-r-full" />
          )}
          {React.createElement(item.icon, {
            className: "h-5 w-5 flex-shrink-0",
          })}
          {expanded && (
            <span className="whitespace-nowrap">
              {item.label === "Esci" && isL_out ? <LoadingSVGV /> : item.label}
            </span>
          )}
        </Link>
      </li>
    );
  };

  const SectionTitle = ({ title }: { title: string }) => {
    if (!expanded) return null;
    return (
      <div className="px-6 mb-2 mt-6 first:mt-0">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "h-screen bg-white fixed left-0 top-0 pt-16 z-10 border-r border-gray-200 transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      {/* Toggle button */}
      <div className="relative mb-2 pb-4">
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-2 bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200 rounded-full p-1 cursor-pointer transition-all shadow-sm hover:shadow z-20"
        >
          {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pb-4">
        <nav className="space-y-1">
          <div>
            <SectionTitle title="Menu" />
            <ul className="space-y-1">
              {dashboardItems.map((item, index) => (
                <NavLink
                  key={item.href}
                  item={item}
                  index={index}
                  section="dashboard"
                />
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle title="Account" />
            <ul className="space-y-1">
              {adminItems.map((item, index) => (
                <NavLink
                  key={item.href}
                  item={item}
                  index={index}
                  section="admin"
                />
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3">
        <ul>
          {footerItems.map((item, index) => (
            <NavLink
              key={item.href}
              item={item}
              index={index}
              section="footer"
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}
