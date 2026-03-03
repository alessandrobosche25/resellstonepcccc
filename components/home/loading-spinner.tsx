"use client";

import { motion } from "framer-motion";

// Skeleton per le card prodotti
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-2.5 space-y-2 flex-1 flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// Skeleton per griglia di card prodotti
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
}

// Skeleton per widget notifiche
export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

// Skeleton per widget richieste
export function RequestSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center gap-2 mt-1">
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// Loading spinner generico per casi speciali
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-[#6033E1] border-t-transparent" />
      </motion.div>
      <p className="mt-4 text-sm text-gray-500 font-medium">Caricamento...</p>
    </div>
  );
}
