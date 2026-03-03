"use server";

import { connectToDatabase } from "../database"; // Assicurati che questa connessione funzioni correttamente
import Notifiche from "@/lib/database/models/notifiche.model"; // Importa il modello Users
import Fuse from 'fuse.js';

export const insertNotifica = async (email: string, titolo: string, descrizione: string, link:string, image: string, linkRicerca:string, mittente:string, nomeMateriale:string ) => {
  try {
    await connectToDatabase(); // Connessione al database

    const newNotifica = new Notifiche({
      email,
      titolo,
      descrizione,
      link, 
      image, 
      linkRicerca, 
      mittente, 
      nomeMateriale
    });

    await newNotifica.save();
    console.log("Nuovo oggetto nel Notifica creato:", newNotifica);
    return newNotifica;
  } catch (error) {
    console.error("Errore durante l'inserimento della notifica:", error);
    throw new Error("Errore durante l'inserimento della notifica");
  }
};

export const getNotificheByEmail = async (email: string) => {
  try {
    await connectToDatabase();
    const query = Notifiche.find({ email: email }).sort({ createdAt: -1 });
    const magazzino = await query.exec();
    return magazzino;
  } catch (error) {
    console.error(
      "Errore durante il recupero dell'oggetto nel magazzino:",
      error
    );
    throw new Error("Errore nel recupero dell'oggetto nel magazzino");
  }
};

export const deleteNotifica = async (id: string) => {
  try {
    await connectToDatabase();

    const result = await Notifiche.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Oggetto non trovato nelle notifiche");
    }
    return result;
  } catch (error) {
    console.error(
      "Errore durante l'eliminazione dell'oggetto nelle notifiche:",
      error
    );
    throw new Error("Errore durante l'eliminazione dell'oggetto nelle notifiche");
  }
};

export const deleteNotificaInutile = async (email: string, nome: string) => {
  try {
    await connectToDatabase();

    // Recupera tutte le notifiche aventi 'mittente' uguale a email
    const notifications = await Notifiche.find({ mittente: email });
    
    if (notifications.length === 0) {
      throw new Error("Nessuna notifica trovata per l'email specificata");
    }

    // Configura Fuse.js per cercare in "nomeMateriale"
    const options = {
      keys: ['nomeMateriale'],
      threshold: 0.3 // Puoi regolare questa soglia per il livello di similarità desiderato
    };

    const fuse = new Fuse(notifications, options);
    
    // Esegui la ricerca fuzzy per il nome passato
    const fuzzyResults = fuse.search(nome);
    
    if (fuzzyResults.length === 0) {
      throw new Error("Nessuna notifica trovata che corrisponde al nome materiale specificato");
    }
    
    // Estrai gli ID delle notifiche da eliminare
    const idsToDelete = fuzzyResults.map(result => result.item._id);
    
    // Elimina tutte le notifiche trovate
    const result = await Notifiche.deleteMany({ _id: { $in: idsToDelete } });
    
    if (result.deletedCount === 0) {
      throw new Error("Nessuna notifica eliminata");
    }
    
    return result;
    
  } catch (error) {
    console.error("Errore durante l'eliminazione delle notifiche:", error);
    throw new Error("Errore durante l'eliminazione delle notifiche");
  }
};