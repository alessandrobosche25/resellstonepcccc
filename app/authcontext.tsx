"use client";
import { redirect } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";

// Global flag for initial loading only
let globalAuthCheckDone = false;

// Array of public pages that don't require auth
const publicPages = ["/", "/subscription", "/error"];

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  checkauth: (force?: boolean, showLoading?: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const afterPaymentRedirectTimer = useRef<NodeJS.Timeout | null>(null);

  // Local ref as backup
  const initialAuthCheckDone = useRef(false);
  // Ref to track ongoing auth checks
  const authCheckInProgress = useRef(false);
  // Last check timestamp
  const lastCheckTime = useRef(0);

  // Handle redirection based on authentication status and current path
  const handleRedirection = () => {
    // If user is authenticated and on a public page
    if (isAuthenticated && publicPages.includes(pathname)) {
      // Special case for afterPayment - wait 15 seconds
      if (pathname === "/afterPayment") {
        // Clear any existing timer
        if (afterPaymentRedirectTimer.current) {
          clearTimeout(afterPaymentRedirectTimer.current);
        }
        afterPaymentRedirectTimer.current = setTimeout(() => {
          console.log("Redirecting from /afterPayment after 15 seconds delay");
          router.push("/home");
        }, 15000); // 15 seconds
      } else if (pathname === "/logIn") {
        redirect("/home");
      } else {
        router.push("/home");
      }
    }
  };

  // Clear timer on unmount or path change
  useEffect(() => {
    return () => {
      if (afterPaymentRedirectTimer.current) {
        clearTimeout(afterPaymentRedirectTimer.current);
      }
    };
  }, [pathname]);

  const checkauth = async (force = false, showLoading = true) => {
    // Skip if check performed in the last 10 seconds and not forced
    const now = Date.now();
    if (!force && now - lastCheckTime.current < 10000) {
      // Se era il check iniziale con loading attivo, dobbiamo comunque disattivarlo
      if (loading && !initialAuthCheckDone.current) {
        setLoading(false);
        initialAuthCheckDone.current = true;
      }
      return;
    }

    // Prevent multiple simultaneous auth checks
    if (authCheckInProgress.current) {
      return;
    }

    authCheckInProgress.current = true;

    // Only show loading indicator if it's an explicit check
    if (showLoading) {
      setLoading(true);
    }

    try {
      console.log(
        `Running auth check - ${force ? "FORCED CHECK" : "REGULAR CHECK"} - ${
          showLoading ? "WITH LOADING" : "BACKGROUND"
        }`
      );
      const response = await fetch("/api/check-auth", {
        method: "GET",
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();

        // User is authenticated and has valid subscription
        setIsAuthenticated(true);
        setUser(data.user);

        console.log("DataUser authcontext", data.user);
        localStorage.setItem("email", data.user.email);

        // Handle redirection with delay for afterPayment
        handleRedirection();
      } else {
        // Authentication or subscription check failed
        setIsAuthenticated(false);
        setUser({});
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Only redirect if not already on a public page
        if (!publicPages.includes(pathname)) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Errore durante la verifica dell'autenticazione:", error);
      setIsAuthenticated(false);
      setUser({});
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Only redirect if not already on a public page
      if (!publicPages.includes(pathname)) {
        router.push("/");
      }
    } finally {
      // Update flags for initial check only
      if (!force) {
        globalAuthCheckDone = true;
        initialAuthCheckDone.current = true;
      }

      lastCheckTime.current = Date.now();
      authCheckInProgress.current = false;

      // Sempre disattivare il loading dopo il check, indipendentemente da showLoading
      setLoading(false);
    }
  };

  // Initial authentication check
  useEffect(() => {
    // Ritarda leggermente il check iniziale per essere sicuri che i cookie siano pronti
    const timer = setTimeout(() => {
      checkauth(false, true); // Show loading for initial check
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Check auth on route changes, but skip for public pages
  useEffect(() => {
    if (!publicPages.includes(pathname)) {
      checkauth(false, false); // Don't show loading on route changes
    }
  }, [pathname]);

  // Handle path change for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      handleRedirection();
    }
  }, [isAuthenticated, pathname]);

  // Periodic check every minute if the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        checkauth(false, false); // Background check, no loading
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, checkauth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
