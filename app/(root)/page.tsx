"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, QrCode, Smartphone, X, Laptop, ArrowRight } from "lucide-react";
import QRCode from "react-qr-code";

const MAIN_SERVER_URL = "https://app.resellstone.com";

export default function Home() {
  const router = useRouter();
  
  // --- STATI LOGIN EMAIL ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // --- STATI UI ---
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRegisterQR, setShowRegisterQR] = useState(false); // Modal registrazione

  // --- STATI LOGIN QR ---
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrStatus, setQrStatus] = useState<"loading" | "waiting" | "authenticated">("loading");

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  // --- 1. INIZIALIZZAZIONE QR (Parte subito al caricamento pagina) ---
  useEffect(() => {
    if (!qrToken) {
      setQrStatus("loading");
      fetch(`${MAIN_SERVER_URL}/api/auth/qr/init`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.qrCode || data.qrToken) {
            setQrToken(data.qrCode || data.qrToken);
            setQrStatus("waiting");
          }
        })
        .catch((err) => console.error("Errore QR Init:", err));
    }
  }, [qrToken]);

  // --- 2. POLLING QR (Controlla ogni 2 sec) ---
  useEffect(() => {
    if (!qrToken || qrStatus === "authenticated") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${MAIN_SERVER_URL}/api/auth/qr/poll?qrCode=${qrToken}`);
        const data = await res.json();

        if (data.status === "authenticated" && data.token) {
          setQrStatus("authenticated");
          clearInterval(interval);
          
          // --- FIX COOKIE: Scrittura manuale per il Middleware ---
          document.cookie = `token=${data.token}; path=/; max-age=1296000; SameSite=Lax; Secure`; 
          
          console.log("🍪 Login QR Riuscito!");

          // Piccola attesa per UX
          setTimeout(() => {
             router.push("/home");
          }, 800);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [qrToken, qrStatus, router]);

  // --- 3. LOGIN EMAIL CLASSICO ---
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/home");
      } else if (response.status === 403) {
        router.push("/subscription");
      } else {
        setError("Credenziali non valide.");
      }
    } catch (error) {
      setError("Si è verificato un errore. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  // Varianti Animazione
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4 font-sans">
      
      {/* CARD PRINCIPALE - Layout a griglia 2 colonne */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={cardVariants}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative z-10"
      >
        
        {/* --- COLONNA SINISTRA: LOGIN EMAIL --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          
          {/* Logo Mobile (visibile solo su schermi piccoli) */}
          <div className="md:hidden flex justify-center mb-6">
             <img src="/img/logoSenzaSfondoNero.png" alt="ResellStone" className="w-16 h-16 object-contain" />
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bentornato</h1>
            <p className="text-gray-500">Inserisci i tuoi dati per accedere.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</Label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 pl-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-[#6033E1] focus:ring-[#6033E1] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#6033E1] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</Label>
              <div className="relative group">
                <Input
                  type={ShowPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 pl-11 pr-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-[#6033E1] focus:ring-[#6033E1] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#6033E1] transition-colors" />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!ShowPassword)}
                >
                  {ShowPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.514a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center justify-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#6033E1] hover:bg-[#4e29b8] text-white font-bold rounded-xl shadow-lg shadow-[#6033E1]/20 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Accesso..." : "Accedi"}
              {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Non hai un account?{" "}
              <button 
                onClick={() => setShowRegisterQR(true)}
                className="text-[#6033E1] font-bold hover:underline"
              >
                Registrati qui
              </button>
            </p>
          </div>
        </div>

        {/* --- DIVISORE / SEPARATORE VISIVO --- */}
        <div className="hidden md:flex flex-col justify-center items-center relative w-[1px] bg-gray-100 my-10">
          <div className="absolute bg-white p-2 rounded-full border border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
            Oppure
          </div>
        </div>
        <div className="md:hidden flex items-center gap-4 px-8 py-2">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase">Oppure</span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        {/* --- COLONNA DESTRA: QR CODE --- */}
        <div className="w-full md:w-1/2 bg-gray-50/50 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
          
          {/* Logo Desktop */}
          <div className="hidden md:flex mb-8">
             <img src="/img/logoSenzaSfondoNero.png" alt="ResellStone" className="w-20 h-20 object-contain opacity-90" />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Accesso Rapido</h2>
            <p className="text-sm text-gray-500 max-w-[250px] mx-auto">
              Inquadra con il tuo telefono per accedere senza password.
            </p>
          </div>

          {/* BOX QR CODE */}
          <div className="relative bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-8 group">
            {/* Angoli decorativi */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#6033E1] rounded-tl-xl"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#6033E1] rounded-tr-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#6033E1] rounded-bl-xl"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#6033E1] rounded-br-xl"></div>

            {qrStatus === "loading" ? (
              <div className="w-[180px] h-[180px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6033E1] mb-3"></div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Caricamento...</span>
              </div>
            ) : qrStatus === "authenticated" ? (
              <div className="w-[180px] h-[180px] flex flex-col items-center justify-center bg-green-50 rounded-lg text-green-600">
                <Laptop className="w-12 h-12 mb-3" />
                <span className="font-bold">Accesso Riuscito!</span>
              </div>
            ) : (
              <div style={{ height: "auto", margin: "0 auto", maxWidth: 180, width: "100%" }}>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={qrToken || ""}
                  viewBox={`0 0 256 256`}
                  fgColor="#1f2937"
                />
              </div>
            )}
          </div>

          {/* ISTRUZIONI */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 w-full max-w-[280px]">
            <ol className="text-xs text-gray-500 text-left space-y-2">
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#6033E1]/10 text-[#6033E1] font-bold text-[10px]">1</span>
                <span>Apri l'app <strong>ResellStone</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#6033E1]/10 text-[#6033E1] font-bold text-[10px]">2</span>
                <span>Vai su <strong>Impostazioni</strong> {'>'} Accedi tramite qrCode</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#6033E1]/10 text-[#6033E1] font-bold text-[10px]">3</span>
                <span>Scansiona il codice qui sopra</span>
              </li>
            </ol>
          </div>

        </div>
      </motion.div>

      {/* --- MODAL REGISTRAZIONE (Per chi non ha account) --- */}
      <Dialog open={showRegisterQR} onOpenChange={setShowRegisterQR}>
        <DialogContent className="max-w-md p-0 border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <div className="bg-[#6033E1] text-white p-6 flex justify-between items-center">
            <h2 className="text-lg font-bold">Scarica l'App</h2>
            <button onClick={() => setShowRegisterQR(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-8 text-center flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${MAIN_SERVER_URL}`}
                alt="Download App"
                className="w-48 h-48"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Scansiona per scaricare la PWA e creare il tuo account in pochi secondi.
            </p>
            <a 
              href={MAIN_SERVER_URL} 
              target="_blank" 
              className="text-[#6033E1] font-bold text-sm hover:underline flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Oppure vai su app.resellstone.com
            </a>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}