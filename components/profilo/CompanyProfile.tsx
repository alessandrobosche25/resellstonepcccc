"use client";

import type React from "react";

import { useAuth } from "@/app/authcontext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Shield,
  X,
  Building2,
  CheckCircle2,
  Crown,
  Star,
  Lock,
  User,
  BarChart3,
  Target,
  Settings,
  Users,
  FolderOpen,
  CheckCircle,
  Cookie,
  Edit3,
  PhoneCall,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function CompanyProfile() {
  const auth = useAuth();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    console.log(auth.user);
  }, [auth.user]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 ml-20">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Card con immagine di sfondo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <Card className="relative border border-gray-200 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-12 relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Logo aziendale */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative group"
                  >
                    <div className="relative h-32 w-32 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-gray-200">
                      <img
                        src={auth?.user?.fileBase64 || "/placeholder.svg"}
                        alt={`${auth?.user?.nomeAzienda} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.4,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#6033E1] border-4 border-white shadow-lg"
                    >
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Info azienda */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Profilo Verificato</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
                    >
                      {auth?.user?.nomeAzienda}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg text-gray-600 mb-6"
                    >
                      Partner certificato ResellStone
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-3 justify-center md:justify-start"
                    >
                      <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        Membro Premium
                      </span>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Griglia informazioni */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                title="Telefono"
                value={auth?.user?.telefono}
                gradient="from-blue-500 to-cyan-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                value={auth?.user?.email}
                gradient="from-purple-500 to-pink-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <ContactCard
                icon={<MapPin className="h-5 w-5" />}
                title="Indirizzo"
                value={auth?.user?.indirizzo}
                gradient="from-green-500 to-emerald-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              onClick={() => setIsPrivacyOpen(true)}
            >
              <ContactCard
                icon={<Shield className="h-5 w-5" />}
                title="Privacy Policy"
                value="Trattamento dei dati personali"
                gradient="from-orange-500 to-red-500"
                clickable
              />
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} {auth?.user?.nomeAzienda} · Tutti i
                diritti riservati
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal per la Privacy Policy */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        companyName={auth?.user?.nomeAzienda || "Azienda"}
      />
    </>
  );
}

function ContactCard({
  icon,
  title,
  value,
  gradient,
  clickable = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient: string;
  clickable?: boolean;
}) {
  const formattedValue =
    value?.toString().length < 10 && title === "Telefono" ? `0${value}` : value;

  return (
    <Card
      className={`group relative border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="relative">
            <div className="rounded-2xl bg-[#6033E1] p-3 text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              {icon}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-base font-medium text-gray-900 break-words">
              {formattedValue}
            </p>
          </div>

          {clickable && (
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacyPolicyModal({
  isOpen,
  onClose,
  companyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}) {
  const titles = [
    "Introduzione",
    "Titolare del Trattamento",
    "Tipologie di Dati Raccolti",
    "Finalità del Trattamento e Base Giuridica",
    "Modalità di Trattamento",
    "Condivisione dei Dati",
    "Conservazione dei Dati",
    "Diritti degli Utenti",
    "Cookie Policy",
    "Modifiche alla Privacy Policy",
    "Contatti",
  ];

  const icons = [
    <Lock className="h-5 w-5" key="lock" />,
    <User className="h-5 w-5" key="user" />,
    <BarChart3 className="h-5 w-5" key="chart" />,
    <Target className="h-5 w-5" key="target" />,
    <Settings className="h-5 w-5" key="settings" />,
    <Users className="h-5 w-5" key="users" />,
    <FolderOpen className="h-5 w-5" key="folder" />,
    <CheckCircle className="h-5 w-5" key="check" />,
    <Cookie className="h-5 w-5" key="cookie" />,
    <Edit3 className="h-5 w-5" key="edit" />,
    <PhoneCall className="h-5 w-5" key="phone" />,
  ];

  const paragraphs = [
    "La presente Privacy Policy descrive in maniera esaustiva le modalità con cui l'applicazione ResellStone raccoglie, utilizza, conserva e protegge i dati personali degli utenti, operando in stretta conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) e con la normativa italiana vigente. La nostra priorità è garantire la massima trasparenza e sicurezza, affinché ogni utente possa sentirsi tutelato e debitamente informato riguardo al trattamento dei propri dati personali. La protezione dei dati personali è un aspetto fondamentale per noi e ci impegniamo a trattare i dati con la massima cura e attenzione.",
    "Titolari del Trattamento: Il trattamento dei dati personali è affidato a: Boschero Alessandro, Manuel Grassini, Rocca Alessandro, Cosio Simone. Contatti: Email: resellstoneteam@gmail.com, Telefono: 379 275 5547.",
    "Tipologia di Dati Raccolti: ResellStone raccoglie dati identificativi e di contatto, quali: nome dell'azienda, indirizzo email, numero di telefono, logo (facoltativo), password e indirizzo fisico. Inoltre, vengono raccolti dati tecnici indispensabili per il corretto funzionamento e la sicurezza dell'applicazione, quali: indirizzo IP, tipo di dispositivo, browser utilizzato e cookie tecnici per l'autenticazione.",
    "Finalità del Trattamento e Base Giuridica: Il trattamento dei dati è finalizzato a: Erogazione del Servizio (creazione account, accesso e gestione) → Base giuridica: esecuzione di un contratto; Adempimenti Legali (conservazione dati per obblighi fiscali e normativi) → Base giuridica: obbligo legale; Analisi e Ottimizzazione (dati aggregati per migliorare il servizio) → Base giuridica: interesse legittimo; Marketing Diretto (newsletter e offerte, con consenso esplicito e revocabile) → Base giuridica: consenso.",
    "Sicurezza dei Dati: I dati personali sono trattati adottando misure tecniche e organizzative adeguate a prevenire accessi non autorizzati, perdite, alterazioni o divulgazioni illecite. Tali misure sono periodicamente riviste e aggiornate in funzione dell'evoluzione delle tecnologie e delle minacce informatiche.",
    "Condivisione dei Dati: I dati raccolti potranno essere comunicati esclusivamente a partner tecnici (ad esempio, fornitori di servizi di hosting, servizi di pagamento, assistenza clienti) e, ove previsto, alle autorità pubbliche competenti in ottemperanza a obblighi di legge. ResellStone si impegna a non vendere né cedere a terzi i dati personali degli utenti.",
    "Conservazione dei Dati: I dati verranno conservati per il tempo strettamente necessario all'erogazione dei servizi richiesti o per adempiere a obblighi legali. Al termine del periodo di conservazione, i dati saranno cancellati o anonimizzati in modo irreversibile.",
    "Diritti degli Utenti: Gli utenti, in conformità con la normativa vigente, hanno il diritto di accedere ai propri dati personali, richiedere la correzione o l'aggiornamento delle informazioni, richiedere la cancellazione dei dati (diritto all'oblio), ottenere la limitazione o opporsi al trattamento dei dati, richiedere la portabilità dei dati e presentare reclamo all'Autorità Garante per la Protezione dei Dati Personali.",
    "Utilizzo dei Cookie: L'applicazione utilizza esclusivamente cookie tecnici, indispensabili per garantire l'autenticazione e il corretto funzionamento del servizio. Non vengono impiegati cookie di profilazione, pubblicitari o di terze parti. Per maggiori dettagli, si prega di consultare l'informativa completa sui cookie.",
    "Modifiche alla Privacy Policy: Ci riserviamo il diritto di aggiornare la presente Privacy Policy in seguito a modifiche normative o esigenze aziendali. In caso di aggiornamenti rilevanti, gli utenti saranno tempestivamente informati tramite l'applicazione o via email.",
    "Contatti: Per qualsiasi domanda o richiesta inerente alla presente Privacy Policy, si prega di contattarci all'indirizzo email resellstoneteam@gmail.com o al numero di telefono 3669800864.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < titles.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none shadow-xl max-w-md overflow-hidden rounded-2xl">
        <div className="w-full bg-white relative" style={{ height: "750px" }}>
          {/* Header con gradiente */}
          <div className="relative bg-gradient-to-r from-[#6033E1] to-[#7a5ce1] pt-12 pb-16 px-6 rounded-t-2xl">
            <div className="absolute inset-0 bg-black/5 pattern-grid-lg opacity-20 rounded-t-2xl"></div>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-[#6033E1] bg-white cursor-pointer transition rounded-full p-1.5 z-10"
              onClick={onClose}
            >
              <X size={18} />
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl font-bold text-center text-white">
              Privacy Policy
            </DialogTitle>
          </div>

          {/* Progress indicator */}
          <div className="px-8 -mt-6 relative z-10">
            <div className="bg-white rounded-xl shadow-lg p-3 flex justify-between items-center">
              <span className="text-sm font-medium text-violet-800">
                Sezione {currentIndex + 1} di {titles.length}
              </span>
              <div className="flex gap-1">
                {titles.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-violet-600 w-4"
                        : index < currentIndex
                        ? "bg-violet-300"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="h-[400px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent"
              >
                <div className="bg-violet-50/50 rounded-xl p-4 mb-4 border border-violet-100">
                  <h2 className="text-xl font-semibold text-violet-800 mb-2 flex items-center gap-3">
                    <span className="p-2 bg-white rounded-lg shadow-sm text-violet-600">
                      {icons[currentIndex]}
                    </span>
                    <span>{titles[currentIndex]}</span>
                  </h2>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm text-left">
                    {paragraphs[currentIndex]}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 left-0 right-0 w-full px-7 flex justify-between">
            <Button
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 shadow-md shadow-violet-200/50 transition-all duration-200"
            >
              <ChevronLeft className="mr-2" />
              Indietro
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === titles.length - 1}
              className="flex items-center bg-violet-700 hover:bg-violet-800 disabled:bg-violet-300 shadow-md shadow-violet-300/50 transition-all duration-200"
            >
              Avanti
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
