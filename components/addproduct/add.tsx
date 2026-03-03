"use client";

import type React from "react";

import { useState } from "react";
import { X, Upload, ArrowRight, Check, Info, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/app/authcontext";
import LoadingSVGM from "../shared/loading/LoadingSVG";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AddMarbleScrap({ onClose }: { onClose?: () => void }) {
  const [nome, setNome] = useState("");
  const [finitura, setFinitura] = useState("");
  const [immagine, setImmagine] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lunghezza, setLunghezza] = useState("");
  const [altezza, setAltezza] = useState("");
  const [spessore, setSpessore] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [filebase, setFileBase] = useState("");
  const [errorAdding, setErroreAdding] = useState(false);
  const [showModal, setShowmodal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const isStep1Complete = nome.trim() !== "";
  const isStep2Complete = finitura.trim() !== "";
  const isStep3Complete = immagine !== null;
  const isStep4Complete = lunghezza !== "" && altezza !== "" && spessore !== "";
  const isFormComplete =
    isStep1Complete && isStep2Complete && isStep3Complete && isStep4Complete;

  const [isAdding, setIsAdding] = useState(false);
  const auth = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImmagine(file);
      setImagePreview(URL.createObjectURL(file));

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFileBase(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setNome("");
    setFinitura("");
    setImmagine(null);
    setImagePreview(null);
    setLunghezza("");
    setAltezza("");
    setSpessore("");
    setQuantity("1");
    setFileBase("");
    setActiveStep(1);
    setDirection(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const _p = {
      nome,
      finitura,
      immagine: filebase,
      lunghezza,
      larghezza: altezza,
      spessore,
      quantity,
      email: auth?.user?.email,
    };
    console.log(_p);

    try {
      setIsAdding(true);
      const response = await fetch("api/insert-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_p),
      });
      if (response.ok) {
        setErroreAdding(false);
        setShowmodal(true);
        handleReset();
        setIsAdding(false);
      } else {
        setIsAdding(false);
        throw new Error("errore nel caricamento");
      }
    } catch (err) {
      setIsAdding(false);
      setErroreAdding(true);
      setShowmodal(true);
    }
  };

  const goToNextStep = () => {
    if (activeStep < 4) {
      setDirection(1);
      setActiveStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (activeStep > 1) {
      setDirection(-1);
      setActiveStep((prev) => prev - 1);
    }
  };

  const steps = [
    { number: 1, label: "Generale", done: isStep1Complete },
    { number: 2, label: "Finitura", done: isStep2Complete },
    { number: 3, label: "Immagine", done: isStep3Complete },
    { number: 4, label: "Dimensioni", done: isStep4Complete },
  ];

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <Card
      className={`bg-white rounded-xl border-2 border-gray-200 shadow-sm w-full max-w-4xl mx-auto ${
        activeStep == 3 ? "mt-16" : "mt-32"
      }`}
    >
      <CardHeader className="bg-white border-b-2 border-gray-200 p-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Aggiungi Materiale
          </h1>
          <p className="text-sm text-gray-600">
            Aggiungi un nuovo sfrido al tuo magazzino virtuale.
          </p>
        </motion.div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 px-4">
          {steps.map((step, index) => {
            const isActive = activeStep >= step.number;
            const isCompleted = step.done && !showModal; // Non mostrare completati dopo l'invio
            const isCurrent = activeStep === step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative z-10"
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isCompleted
                      ? "bg-[#6033E1] text-white"
                      : isCurrent
                      ? "bg-[#6033E1]/20 text-[#6033E1] border-2 border-[#6033E1]"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  }`}
                  onClick={() => {
                    if (
                      step.number < activeStep ||
                      steps[step.number - 2]?.done
                    ) {
                      setDirection(step.number > activeStep ? 1 : -1);
                      setActiveStep(step.number);
                    }
                  }}
                  animate={
                    isCurrent
                      ? { scale: [1, 1.05, 1] }
                      : isCompleted
                      ? { backgroundColor: "#6033E1", color: "#ffffff" }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </motion.div>
                <motion.span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? "text-[#6033E1]" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </motion.span>
                {index < steps.length - 1 && (
                  <motion.div
                    className="absolute top-5 left-[3.25rem] h-0.5 bg-gray-200"
                    style={{ width: "calc(100% - 3.25rem)" }}
                  >
                    <motion.div
                      className="h-full bg-[#6033E1]"
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          isActive && !showModal && steps[index + 1].done
                            ? "100%"
                            : "0%",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-8 min-h-[200px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Nome */}
            {activeStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="name"
                    className="text-lg font-medium text-gray-800"
                  >
                    Nome Materiale
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          Dai al tuo sfrido un nome chiaro e descrittivo.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Inserisci il nome dello sfrido"
                  className="text-base py-6"
                  required
                />
                <p className="text-xs text-[#6033E1]">
                  Dai al tuo sfrido un nome chiaro e descrittivo.
                </p>
                <div className="mt-8 flex justify-end">
                  <Button
                    type="button"
                    className="bg-[#6033E1] text-white cursor-pointer hover:bg-[#7a5ce1] transition-colors"
                    disabled={!isStep1Complete}
                    onClick={goToNextStep}
                  >
                    Continua <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Finitura */}
            {activeStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="finish"
                    className="text-lg font-medium text-gray-800"
                  >
                    Finitura
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          Seleziona il tipo di finitura del materiale.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={finitura} onValueChange={setFinitura}>
                  <SelectTrigger
                    id="finish"
                    className="text-base py-6 hover:border-[#6033E1] transition-colors duration-300 w-full"
                  >
                    <SelectValue placeholder="Seleziona una finitura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nessuna">Nessuna</SelectItem>
                    <SelectItem value="spazzolato">Spazzolato</SelectItem>
                    <SelectItem value="fiammato">Fiammato</SelectItem>
                    <SelectItem value="lucido">Lucido</SelectItem>
                    <SelectItem value="bocciardato">Bocciardato</SelectItem>
                    <SelectItem value="grezzo">Grezzo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#6033E1]">
                  La finitura influisce sull'aspetto e sull'utilizzo del
                  materiale.
                </p>
                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
                    className="cursor-pointer"
                  >
                    Indietro
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#6033E1] text-white cursor-pointer  hover:bg-[#7a5ce1] transition-colors"
                    disabled={!isStep2Complete}
                    onClick={goToNextStep}
                  >
                    Continua <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Immagine */}
            {activeStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium text-gray-800">
                    Immagine
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          Carica un'immagine rappresentativa dello sfrido di
                          marmo.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div
                  className={`mt-2 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
                    imagePreview
                      ? "border-[#6033E1]/30 bg-[#6033E1]/5"
                      : "border-[#6033E1]/50 hover:bg-[#6033E1]/5"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="mx-auto max-h-64 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImmagine(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors"
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-[#6033E1]/70 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 mb-3">
                        Trascina l'immagine qui, oppure
                      </p>
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2.5 bg-[#6033E1] text-white rounded-lg cursor-pointer hover:bg-[#7a5ce1] transition-colors text-sm font-medium"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Seleziona un file
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-3">
                        PNG, JPG, GIF fino a 10MB
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#6033E1]">
                  Carica un'immagine rappresentativa dello sfrido di marmo.
                </p>
                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
                    className="cursor-pointer"
                  >
                    Indietro
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#6033E1] text-white cursor-pointer  hover:bg-[#7a5ce1] transition-colors"
                    onClick={async () => {
                      if (!imagePreview) {
                        // Assegna un'immagine di default se non è stata caricata nessuna immagine
                        const response = await fetch("/img/logo.svg");
                        const blob = await response.blob();

                        // 2. Crea un File object simile a quello che otterresti da un input file
                        const file = new File([blob], "default-image.jpg", {
                          type: blob.type,
                        });

                        // 3. Imposta gli stati come faresti con un file normale
                        setImmagine(file);
                        setImagePreview(URL.createObjectURL(blob));

                        // 4. Converti in base64
                        const reader = new FileReader();
                        reader.onload = () => {
                          const base64String = reader.result as string;
                          setFileBase(base64String);
                        };
                        reader.readAsDataURL(blob);
                      }
                      goToNextStep();
                    }}
                  >
                    Continua <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Dimensioni */}
            {activeStep === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium text-gray-800">
                    Dimensioni e Quantità
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          Inserisci le dimensioni precise del materiale in
                          centimetri.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="length"
                      className="text-sm font-medium text-gray-700"
                    >
                      Lunghezza (cm)
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      min="0"
                      step="0.1"
                      value={lunghezza}
                      onChange={(e) => setLunghezza(e.target.value)}
                      placeholder="0.0"
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="height"
                      className="text-sm font-medium text-gray-700"
                    >
                      Altezza (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="0"
                      step="0.1"
                      value={altezza}
                      onChange={(e) => setAltezza(e.target.value)}
                      placeholder="0.0"
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="thickness"
                      className="text-sm font-medium text-gray-700"
                    >
                      Spessore (cm)
                    </Label>
                    <Input
                      id="thickness"
                      type="number"
                      min="0"
                      step="0.1"
                      value={spessore}
                      onChange={(e) => setSpessore(e.target.value)}
                      placeholder="0.0"
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="quantity"
                      className="text-sm font-medium text-gray-700"
                    >
                      Quantità
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      step="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                      className="text-base"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#6033E1]">
                  Misure precise aiuteranno gli acquirenti a valutare l'idoneità
                  del materiale.
                </p>
                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
                  >
                    Indietro
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-[#6033E1] text-white"
                    disabled={!isFormComplete || isAdding}
                  >
                    {isAdding ? (
                      <div className="flex items-center">
                        <LoadingSVGM />
                        <span className="ml-2">Aggiunta in corso...</span>
                      </div>
                    ) : (
                      <>
                        Aggiungi Materiale
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="bg-violet-50 p-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancella tutto
        </Button>
        <div className="flex items-center space-x-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`w-2 h-2 rounded-full ${
                activeStep >= step.number ? "bg-[#6033E1]" : "bg-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {activeStep} di {steps.length}
          </span>
        </div>
      </CardFooter>

      <AlertDialog open={showModal} onOpenChange={setShowmodal}>
        <AlertDialogContent className="bg-white rounded-lg overflow-hidden max-w-md">
          <AlertDialogHeader className="p-6 pb-2">
            {!errorAdding ? (
              <>
                <AlertDialogTitle className="flex items-center text-xl font-bold text-gray-800">
                  <FaCheckCircle className="text-green-500 mr-2 text-xl" />
                  Prodotto aggiunto con successo
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600 mt-2">
                  Il prodotto è stato aggiunto al magazzino con successo.
                </AlertDialogDescription>
              </>
            ) : (
              <>
                <AlertDialogTitle className="flex items-center text-xl font-bold text-gray-800">
                  <FaTimesCircle className="text-red-500 mr-2 text-xl" />
                  Fallimento nell'aggiunta del prodotto
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600 mt-2">
                  C'è stato un errore nell'aggiunta del prodotto. Riprova più
                  tardi.
                </AlertDialogDescription>
              </>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="p-6 pt-2">
            <AlertDialogAction
              onClick={() => setShowmodal(false)}
              className="bg-[#6033E1] hover:bg-[#7a5ce1] text-white w-full py-2.5 rounded-lg font-medium"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
