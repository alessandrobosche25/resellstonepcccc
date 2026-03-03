  "use client"
  
  import React, { useEffect } from "react"
  import { useRouter } from "next/navigation"
  import { motion } from "framer-motion"
  import { AlertTriangle } from "lucide-react"
  
  const UnavailablePage = () => {
    const router = useRouter()
  
    // Poll every 5 seconds to check availability of target site
    useEffect(() => {
      const intervalId = setInterval(() => {
        fetch("https://www.resellstone.com", { method: "HEAD" })
          .then((response) => {
            if (response.ok) {
              // If the site is reachable, redirect to it
              window.location.href = "https://www.resellstone.com"
            }
          })
          .catch(() => {
            // If request fails (e.g., 502), do nothing and continue polling
          })
      }, 5000)
  
      return () => clearInterval(intervalId)
    }, [])
  
    const fadeInUp = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }
  
    return (
      <section className="py-20 px-5 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-100/40 to-transparent rounded-full blur-3xl -z-10 transform -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-100/40 to-transparent rounded-full blur-3xl -z-10 transform translate-x-1/3 translate-y-1/3"></div>
  
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5 -z-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
                <path
                  d="M0,0 L300,300 M300,0 L0,300 M150,0 L150,300 M0,150 L300,150"
                  stroke="#6033E1"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
  
        <div className="max-w-7xl mx-auto">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 relative"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-[#6033E1]" strokeWidth={2} />
              </motion.div>
            </div>
  
            <h2 className="mb-6 text-5xl sm:text-6xl tracking-tight font-extrabold relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-[#6033E1] to-indigo-600 blur-lg opacity-20 rounded-lg transform scale-110"></span>
              <span
                className="relative"
                style={{
                  background: "linear-gradient(135deg, #6033E1 0%, #6366F1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Oops! Il sito al momento non è disponibile
              </span>
            </h2>
  
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="h-1 bg-gradient-to-r from-[#6033E1] to-indigo-500 mx-auto rounded-full mb-8"
            />
  
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ci scusiamo per l'inconveniente. Stiamo lavorando per ripristinare il servizio il prima possibile.
            </motion.p>
          </motion.section>
        </div>
      </section>
    )
  }
  
  export default UnavailablePage;

