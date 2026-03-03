"use client";

import { useState, useEffect, useRef } from "react";
import NotificheCard from "./NotificheCard";
import RichiesteNotificheCard from "./RichiesteNotificheCard";
import { useAuth } from "@/app/authcontext";
import type { INotifiche } from "@/lib/database/models/notifiche.model";
import type { IRichiesteNotifiche } from "@/lib/database/models/richiesteNotifiche.model";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "../home/sidebar-context";
import { Bell, Clock, Trash2, AlertTriangle } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="relative flex items-center bg-white rounded-lg p-4 w-full border-2 border-gray-200 animate-pulse"
      >
        <div className="rounded-lg bg-gray-200 w-12 h-12 mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="border-2 border-gray-200 px-3 py-1.5 rounded-lg">
          <div className="h-3 bg-gray-200 rounded w-10"></div>
        </div>
      </div>
    ))}
  </div>
);

const NotificheBody = () => {
  const fetcher = (url: string, email: any) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((res) => res.json());

  const fetcherRichiesteNotifiche = (url: string, email: any) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((res) => res.json());

  const auth = useAuth();
  const {
    data: notifiche,
    error: errorNotifiche,
    isLoading: isLoadingNotifiche,
  } = useSWR<INotifiche[]>(
    auth?.user?.email ? [`/api/getNotificheByEmail`, auth?.user?.email] : null,
    ([url, email]) => fetcher(url, email)
  );

  const {
    data: richiesteNotifiche,
    error: errorRichiesteNotifiche,
    isLoading: isLoadingRichiesteNotifiche,
  } = useSWR<IRichiesteNotifiche[]>(
    auth?.user?.email
      ? [`/api/getRichiesteNotificheByEmail`, auth?.user?.email]
      : null,
    ([url, email]) => fetcherRichiesteNotifiche(url, email)
  );

  const [localNotifications, setLocalNotifications] = useState(
    notifiche?.map((notifica) => ({ ...notifica, id: uuidv4() })) || []
  );

  const [localRichiesteNotifications, setLocalRichiesteNotifications] =
    useState(
      richiesteNotifiche?.map((notifica) => ({ ...notifica, id: uuidv4() })) ||
        []
    );
  const [loading, setLoading] = useState(false);
  const [showRecentNotifications, setShowRecentNotifications] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [
    selectedRichiesteNotificationsId,
    setSelectedRichiesteNotificationsId,
  ] = useState<string[] | null>(null);
  const [draggedNotificationId, setDraggedNotificationId] = useState<
    string | null
  >(null);
  const [isOldNotifications, setIsOldNotifications] = useState(false);
  const [disableInitialAnimation, setDisableInitialAnimation] = useState(true);
  const [
    selectedRichiesteNotificationsNames,
    setSelectedRichiesteNotificationsNames,
  ] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => setDisableInitialAnimation(false), 500);
  }, []);

  useEffect(() => {
    if (!notifiche) return;
    setLocalNotifications(
      notifiche.map((notifica) => ({ ...notifica, id: uuidv4() }))
    );
  }, [notifiche]);

  useEffect(() => {
    if (!richiesteNotifiche) return;
    console.log("queste sono le richieste notifiche:", richiesteNotifiche);
    setLocalRichiesteNotifications(
      richiesteNotifiche.map((notifica) => ({ ...notifica, id: uuidv4() }))
    );
  }, [richiesteNotifiche]);

  const hasCalledRemovalRef = useRef(false);

  const handleRemoveNotification = async (id: string) => {
    const notification = localNotifications.find(
      (notifica) => notifica.id === id
    );
    if (!notification) return;

    setLocalNotifications((prev) =>
      prev.filter((notifica) => notifica.id !== id)
    );

    try {
      console.log("Rimuovi notifica dal database:", notification);
      await fetch(`/api/deleteNotifica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: notification._id }),
      });
    } catch (error) {
      console.error("Errore durante la rimozione della notifica dal DB", error);
    }
  };

  const handleUpdateNotification = async (id: string) => {
    const notification = localRichiesteNotifications.find(
      (notifica) => notifica.id === id
    );
    if (!notification) return;

    setLocalNotifications((prev) =>
      prev.filter((notifica) => notifica.id !== id)
    );

    try {
      console.log("Aggiornamento notifica dal database:", notification);
      await fetch(`/api/updateScadenzaRichiestaNotifica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: notification._id }),
      });
    } catch (error) {
      console.error("Errore durante la rimozione della notifica dal DB", error);
    }
  };

  const handleRemoveRichiesteNotification = async (id: string) => {
    const notification = localRichiesteNotifications.find(
      (notifica) => notifica.id === id
    );
    if (!notification) return;

    setLocalRichiesteNotifications((prev) =>
      prev.filter((notifica) => notifica.id !== id)
    );

    try {
      console.log("Rimuovi notifica dal database:", notification);
      await fetch(`/api/deleteRichiestaNotifica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: notification._id }),
      });
    } catch (error) {
      console.error("Errore durante la rimozione della notifica dal DB", error);
    }
  };

  const handleRemoveOldRichiesteNotifications = async (id: string) => {
    const notification = localRichiesteNotifications.find(
      (notifica) => notifica.id === id
    );
    if (!notification) return;

    setLocalRichiesteNotifications((prev) =>
      prev.filter((notifica) => notifica.id !== id)
    );

    try {
      console.log("Rimuovi notifica dal database:", notification);
      await fetch(`/api/deleteRichiestaNotifica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: notification._id }),
      });
    } catch (error) {
      console.error("Errore durante la rimozione della notifica dal DB", error);
    }
  };

  const handleRemoveAllNotifications = async () => {
    if (localNotifications.length === 0) return;

    setLoading(true);

    try {
      await Promise.all(
        localNotifications.map(async (notifica) => {
          await fetch(`/api/deleteNotifica`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: notifica._id }),
          });
        })
      );

      setLocalNotifications([]);
      setLoading(false);
    } catch (error) {
      console.error(
        "Errore durante la rimozione delle notifiche dal DB",
        error
      );
      setLoading(false);
    }
  };

  const formattedNotifications = localNotifications.map((notifica) => ({
    id: notifica.id,
    azienda: notifica.titolo || "Azienda Sconosciuta",
    text: notifica.descrizione,
    tempo: new Date(notifica.createdAt).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    image: notifica.image || "/placeholder-image.png",
    link: notifica.link || "",
    isRead: true,
  }));

  const formattedRichiesteNotifications = localRichiesteNotifications.map(
    (notifica) => {
      const createdAtDate = new Date(notifica.dataRipristino);
      const now = new Date();
      const daysPassed = Math.floor(
        (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const hourPassed = Math.floor(
        (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60)
      );
      const minutesPassed = Math.floor(
        (now.getTime() - createdAtDate.getTime()) / (1000 * 60)
      );

      return {
        id: notifica.id,
        email: notifica.email,
        nomeMateriale: notifica.nomeMateriale,
        tempo: createdAtDate.toLocaleString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        finitura: notifica.finitura || "",
        isRead: true,
        daysPassed,
        hourPassed,
        minutesPassed,
        idXdelete: notifica._id,
      };
    }
  );

  const openDialogForRemoval = (id: string, isRequestNotification = false) => {
    setSelectedNotificationId(id);
    setIsOldNotifications(isRequestNotification);
    setIsDialogOpen(true);
  };

  const confirmRemoveNotification = async () => {
    if (!selectedNotificationId) return;

    if (isOldNotifications) {
      const notification = localRichiesteNotifications.find(
        (notifica) => notifica.id === selectedNotificationId
      );
      if (notification) {
        await handleRemoveRichiesteNotification(selectedNotificationId);
      }
    } else {
      const notification = localNotifications.find(
        (notifica) => notifica.id === selectedNotificationId
      );
      if (notification) {
        await handleRemoveNotification(selectedNotificationId);
      }
    }

    setIsDialogOpen(false);
    setSelectedNotificationId(null);
    setIsOldNotifications(false);
  };

  const confirmRemoveOldNotifications = async () => {
    if (!selectedRichiesteNotificationsId) return;

    if (selectedRichiesteNotificationsId) {
      for (const id of selectedRichiesteNotificationsId) {
        await handleRemoveOldRichiesteNotifications(id);
      }
    }

    setIsDialogOpen(false);
    setSelectedNotificationId(null);
  };

  const confirmRemoveRichiesteNotification = async () => {
    if (!selectedNotificationId) return;

    const notification = localRichiesteNotifications.find(
      (notifica) => notifica.id === selectedNotificationId
    );

    if (notification) {
      await handleRemoveRichiesteNotification(selectedNotificationId);
    }

    setIsDialogOpen(false);
    setSelectedNotificationId(null);
  };

  const { expanded } = useSidebar();

  return (
    <div className="m-auto mt-18">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              {showRecentNotifications
                ? "Notifiche"
                : "Richieste insoddisfatte"}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span>Scorri per eliminare</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => {
                setShowRecentNotifications(true);
                setSelectedNotificationId(null);
                setIsOldNotifications(false);
              }}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                showRecentNotifications
                  ? "bg-white text-[#6033E1] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <div className="flex items-center justify-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifiche
              </div>
            </button>
            <button
              onClick={() => {
                setShowRecentNotifications(false);
                setSelectedNotificationId(null);
                setIsOldNotifications(false);
              }}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                !showRecentNotifications
                  ? "bg-white text-[#6033E1] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <div className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                Richieste
              </div>
            </button>
          </div>

          {/* Legend for request notifications */}
          {!showRecentNotifications && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-[#6033E1] mb-2 font-bold text-center">
                Giorni trascorsi dalla richiesta:
              </p>
              <div className="flex items-center justify-around">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs">fino a 5</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs">fino a 10</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs">fino a 15</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={`mt-4 ${
            !showRecentNotifications ? "max-h-[490px]" : "max-h-[580px]"
          } scrollbar-hide`}
        >
          <AnimatePresence mode="wait">
            {/* Notifications section */}
            {showRecentNotifications ? (
              isLoadingNotifiche || disableInitialAnimation ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingSkeleton />
                </motion.div>
              ) : (notifiche?.length || 0) > 0 ? (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificheCard
                    className={disableInitialAnimation ? "no-animation" : ""}
                    notifiche={formattedNotifications}
                    onRemove={(id) => openDialogForRemoval(id, false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-center font-medium">
                    Nessuna notifica da leggere
                  </p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Le notifiche appariranno qui quando disponibili
                  </p>
                </motion.div>
              )
            ) : isLoadingRichiesteNotifiche ? (
              <motion.div
                key="skeletonRichiesteNotifiche"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : (richiesteNotifiche?.length || 0) > 0 ? (
              <motion.div
                key="richiesteCards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RichiesteNotificheCard
                  notifiche={formattedRichiesteNotifications}
                  onRemove={(id) => {
                    setSelectedNotificationId(id);
                    setIsOldNotifications(false);
                    setIsDialogOpen(true);
                  }}
                  onRemoveOldNotifications={(ids, names) => {
                    console.log("Eliminazione notifiche con id:", ids);
                    console.log(
                      "Eliminazione notifiche con nomeMateriale:",
                      names
                    );
                    setIsOldNotifications(true);
                    setSelectedRichiesteNotificationsId(ids);
                    setSelectedRichiesteNotificationsNames(names);
                    setIsDialogOpen(true);
                  }}
                  onUpdateScadenza={async (id) => {
                    console.log("aggiornamento scadenza notifiche con id:", id);
                    await handleUpdateNotification(id);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="emptyRichieste"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center font-medium">
                  Nessuna richiesta insoddisfatta
                </p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Le richieste appariranno qui quando disponibili
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dialog for confirmation */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-white rounded-lg p-0 overflow-hidden max-w-md">
          <AlertDialogHeader className="p-6 pb-2">
            <AlertDialogTitle className="text-xl font-bold text-gray-800 flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              {showRecentNotifications
                ? "Elimina notifica"
                : isOldNotifications
                ? "Elimina richieste scadute"
                : "Elimina richiesta"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              {showRecentNotifications
                ? "Sei sicuro di voler eliminare questa notifica?"
                : isOldNotifications
                ? "Sei sicuro di voler eliminare queste richieste notifiche scadute?"
                : "Sei sicuro di voler eliminare questa richiesta notifica?"}
              {isOldNotifications &&
                selectedRichiesteNotificationsNames.length > 0 && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Elementi da eliminare:
                    </p>
                    <ul className="space-y-1">
                      {selectedRichiesteNotificationsNames.map(
                        (name, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                            {name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={
                showRecentNotifications
                  ? confirmRemoveNotification
                  : isOldNotifications
                  ? confirmRemoveOldNotifications
                  : confirmRemoveRichiesteNotification
              }
              className="bg-[#6033E1] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#4f2bc0] transition-colors w-full sm:w-auto"
            >
              Conferma
            </AlertDialogAction>

            <AlertDialogAction
              onClick={() => setIsDialogOpen(false)}
              className="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Annulla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Trash bin for drag-to-delete */}
      {draggedNotificationId && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center w-14 h-14"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedNotificationId) {
              openDialogForRemoval(draggedNotificationId);
              setDraggedNotificationId(null);
            }
          }}
        >
          <Trash2 className="w-6 h-6" />
        </motion.div>
      )}
    </div>
  );
};

export default NotificheBody;
