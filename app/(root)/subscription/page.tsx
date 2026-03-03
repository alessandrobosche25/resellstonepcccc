"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import type { Mesh } from "three"
import QRCode from "react-qr-code"

interface FloatingObjectProps {
  position: [number, number, number]
  color: string
  speed?: number
  rotationFactor?: number
  size?: number
}

function FloatingCube({ position, color, speed = 1, rotationFactor = 0.01 }: FloatingObjectProps) {
  const mesh = useRef<Mesh>(null!)

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.getElapsedTime()
    mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.1
    mesh.current.rotation.x += rotationFactor
    mesh.current.rotation.y += rotationFactor * 0.5
  })

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function FloatingSphere({ position, color, speed = 1, size = 0.3 }: FloatingObjectProps) {
  const mesh = useRef<Mesh>(null!)

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.getElapsedTime()
    mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.1
    mesh.current.position.x = position[0] + Math.cos(time * speed * 0.5) * 0.05
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <Environment preset="city" />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <FloatingCube position={[-2, 0, -1]} color="#6033E1" speed={1.2} />
        <FloatingCube position={[2, 0.5, -2]} color="#00cec9" speed={0.8} />
        <FloatingSphere position={[1.5, -0.5, -1]} color="#fd79a8" speed={1} />
        <FloatingSphere position={[-1.5, 0.8, -1.5]} color="#00b894" speed={1.3} size={0.2} />
        <FloatingSphere position={[0, 1.2, -1]} color="#fdcb6e" speed={0.7} size={0.15} />
      </Float>
    </>
  )
}

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [isHovered, setIsHovered] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const price = billingCycle === "monthly" ? "12" : "120"
  const period = billingCycle === "monthly" ? "mese" : "anno"
  const savings = billingCycle === "annual" ? "Risparmi €24 all'anno" : ""

  const handleStartNow = () => {
    setShowQRCode(true)
  }

  const handleCloseQR = () => {
    setShowQRCode(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a20]/40 to-[#1a1a40] p-4 overflow-hidden">
      {/* Background 3D elements */}
      <div className="absolute inset-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <AnimatePresence mode="wait">
          {!showQRCode ? (
            <Card
              key="subscription-card"
              className="bg-[#0e0e2c]/80 border border-[#2a2a50]/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 flex flex-col items-center">
                <motion.h1
                  className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#beaeec] to-[#a850e2] mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Piano Abbonamento ResellStone
                </motion.h1>

                <motion.p
                  className="text-gray-300 text-center max-w-xl mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Accedi a tutte le funzionalità, ruoli utente e permessi, accessibilità app mobile, ricerca di altri sfridi e aggiunta nel magazzino virtuale e supporto clienti prioritario.
                </motion.p>

                {/* Pricing display */}
                <motion.div
                  className="mb-8 text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-white text-3xl">€</span>
                    <span className="text-white text-7xl font-bold mx-2">{price}</span>
                    <div className="text-gray-400 text-lg text-left">
                      <p>/{period}</p>
                    </div>
                  </div>
                  {savings && (
                    <motion.p
                      className="text-gray-200 mt-2 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      {savings}
                    </motion.p>
                  )}
                </motion.div>

                {/* Billing toggle */}
                <motion.div
                  className="inline-flex items-center bg-[#1a1a40] rounded-full p-1 mb-10 relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10 cursor-pointer ${
                      billingCycle === "monthly" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Mensile
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10 cursor-pointer ${
                      billingCycle === "annual" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Annuale
                  </button>
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-full bg-[#6033E1] z-0"
                    initial={false}
                    animate={{
                      left: billingCycle === "monthly" ? "4px" : "50%",
                      right: billingCycle === "monthly" ? "50%" : "4px",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                </motion.div>

                {/* Features */}
                <motion.div
                  className="w-full mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {[
                    "Accesso illimitato a tutti i contenuti",
                    "Supporto prioritario 24/7",
                    "Ricerca di sfridi avanzata",
                    "Accesso al magazzino Virtuale",
                    "Personalizzazione dell'account",
                    "Aggiornamenti in anteprima",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-[#6033E1] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.p
                  className="text-gray-400 text-sm mb-6 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 text-[#6033E1]"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Pagamento sicuro al 100% con garanzia soddisfatti o rimborsati.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <Button
                    className="w-full py-6 text-lg font-medium relative overflow-hidden group cursor-pointer"
                    style={{
                      background: "#6033E1",
                      color: "#fff",
                    }}
                    onClick={handleStartNow}
                  >
                    <span className="relative z-10">Inizia ora</span>
                  
                  </Button>
                </motion.div>
              </div>
            </Card>
          ) : (
            <motion.div
              key="qr-code-card"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.5,
              }}
              className="bg-[#0e0e2c]/90 border border-[#2a2a50]/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl p-8 flex flex-col items-center"
            >
              <motion.h2
                className="text-3xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Scansiona il QR Code
              </motion.h2>

              <motion.p
                className="text-gray-300 text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Usa la fotocamera del tuo smartphone per completare il pagamento
              </motion.p>

              <motion.div
                className="bg-white p-4 rounded-xl mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
              >
                <QRCode
                  value={`https://app.resellstone.com/paymentPage`}
                  size={200}
                  level="H"
                  fgColor="#6033E1"
                />
              </motion.div>

              <motion.div
                className="text-center mb-8 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <p className="text-white font-bold text-xl mb-1 cursor-pointer">
                  Piano {billingCycle === "monthly" ? "Mensile" : "Annuale"}
                </p>
                <p className="text-[#6033E1] text-2xl font-bold">€{price}</p>
              </motion.div>

              <motion.div  animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}>
                <Button
                  variant="outline"
                  className="bg-[#6033E1] text-white border border-[#6033E1] cursor-pointer hover:bg-[#6033E1]/80 hover:text-white"
                  onClick={handleCloseQR}
                >
                  Torna indietro
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
