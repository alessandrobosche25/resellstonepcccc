"use server";

import { connectToDatabase } from "../database"; // Assicurati che questa connessione funzioni correttamente
import RichiesteNotifiches from "@/lib/database/models/richiesteNotifiche.model"; // Importa il modello Users
import Fuse from "fuse.js";
import mongoose from "mongoose";

export const insertRichiesteNotifiche = async (
  email: string,
  nomeMateriale: string,
  finitura?: string,

) => {
  try {
    await connectToDatabase(); // Connessione al database

    const newRichiesteNotifiche = new RichiesteNotifiches({
      email,
      nomeMateriale,
      finitura,
    });

    await newRichiesteNotifiche.save();
    return newRichiesteNotifiche; 
  } catch (error) {
    console.error(
      "Errore durante l'inserimento dell'oggetto nel RichiesteNotifiche:",
      error
    );
    throw new Error("Errore durante l'inserimento dell'oggetto nel RichiesteNotifiche");
  }
};

export const getRichiesteNotificheByNome = async (nomeMateriale: string, finitura: string) => {
  try {
    await connectToDatabase();
    const tutteRichieste = await RichiesteNotifiches.find().exec();
    console.log("tutteRichieste: ", tutteRichieste);
    
    // Configurazione di Fuse.js
    const options = {
      keys: ["nomeMateriale"], // Campo da confrontare
      threshold: 0.5,          // Più basso, più stringente
    };

    const fuse = new Fuse(tutteRichieste, options);
    const risultati = fuse.search(nomeMateriale);
    console.log("risultati: --", risultati);
    // Se "finitura" è vuota, restituisci tutti i risultati (filtrati solo per nome)
    // Altrimenti, filtra ulteriormente per finitura
    

      if(finitura != "") {
        const risultatiFiltrati = risultati
      .map((risultato) => risultato.item)
      .filter((richiesta) => {
        return richiesta.finitura === finitura;
      });
      console.log("dio engro")
       return risultatiFiltrati;
    } else return risultati;
    return risultati;

  } catch (error) {
    console.error("Errore durante il recupero delle richieste:", error);
    throw new Error("Errore nel recupero delle richieste");
  }
};



export const getRichiesteNotificheByEmail = async (email: string) => {
  try {
      await connectToDatabase();
      const query = RichiesteNotifiches.find({ email: email }).sort({ createdAt: -1 });
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




export const getRichiesteNotifiche = async () => {
  try {
    await connectToDatabase();
    const query = RichiesteNotifiches.find({});
    const magazzino = await query.exec();
    console.log("richieste notifiche trovate: ----------------------", magazzino);
    return magazzino;
  } catch (error) {
    console.error(
      "Errore durante il recupero dell'oggetto nel richieste notifiche:",
      error
    );
    throw new Error("Errore nel recupero dell'oggetto nel richieste notifiche");
  }
};


export const deleteRichiestaNotifica = async (id: string) => {
  try {
    await connectToDatabase();
    console.log("id ricevuto -----------------:", id);
    const idMongo = new mongoose.Types.ObjectId(id)
    console.log("id in formato ObjectId -------------:", idMongo);

    const byStringId = await RichiesteNotifiches.findOne({ _id: id });
console.log("Ricerca con stringa -------:", byStringId);

    const result = await RichiesteNotifiches.findByIdAndDelete(idMongo);

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



export const updateScadenzaRichiestaNotifica = async (id: string) => {
  try {
    await connectToDatabase();
console.log("id ricevuto -----------------:", id);
const idMongo = new mongoose.Types.ObjectId(id);

// Utilizza l'ObjectId nella ricerca per maggiore coerenza
const byStringId = await RichiesteNotifiches.findOne({ _id: idMongo });
console.log("Ricerca con ObjectId -------:", byStringId);

const updatedAt = new Date();
console.log("updatedAt: ", updatedAt);

// Usa idMongo nella query di aggiornamento
const result = await RichiesteNotifiches.updateOne(
  { _id: idMongo },
  { $set: { dataRipristino: updatedAt } }
);

console.log("Update result:", result);

// Formatta correttamente il log usando template literals e conversioni in stringa
console.log(`Eseguo l'aggiornamento: RichiesteNotifiches.updateOne(
  { _id: ${idMongo.toString()} },
  { $set: { dataRipristino: ${updatedAt.toISOString()} } }
)`);


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