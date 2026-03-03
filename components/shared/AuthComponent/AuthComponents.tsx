"use client";

import React from "react";
import { useAuth } from "../../../app/authcontext";

function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <style jsx>{`
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #800080; /* Changed from #000 to purple */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
}
