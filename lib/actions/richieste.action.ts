"use server";

import { cp } from "fs";
import { connectToDatabase } from "../database"; // Assicurati che questa connessione funzioni correttamente
import Richiesta from "@/lib/database/models/richieste.model"; // Importa il modello Users

export const insertRichiesta = async (emailMateriale: string, emailUser:string, nomeMateriale:string, distanza:string, misure?:string, image?:string,  finitura?: string) => {
  try {
    const existingRichiesta = await getRichiestaSpecifica(
      emailMateriale,
      emailUser,
      nomeMateriale,
      distanza,
      misure,
      image,
      finitura
    );

    if (existingRichiesta) {
      console.log("Richiesta già esistente, non verrà creata:", existingRichiesta);
      return existingRichiesta; // Restituisci la richiesta trovata
    }

    // Crea una nuova richiesta se non esiste
    const newRichiesta = new Richiesta({
      emailMateriale,
      emailUser,
      nomeMateriale,
      distanza,
      misure,
      image,
      finitura,
    });

    console.log("Nuovo emailUser nel Richiesta creato: ", emailUser);
    console.log("Nuovo oggetto nel Richiesta creato: ", newRichiesta);

    await newRichiesta.save();

    console.log("Richiesta inserita con successo:", newRichiesta);
    return newRichiesta;
  } catch (error) {
    console.error("Errore durante l'inserimento della richiesta:", error);
    throw new Error("Errore durante l'inserimento della richiesta");
  }
};

export const getRichiesta = async () => {
  try {
    await connectToDatabase();
    const richiesta = await Richiesta.findOne();
    console.log(richiesta);
   
  } catch (error) {
    console.error("Errore durante il recupero della richiesta:", error);
    throw new Error("Errore nel recupero della richiesta");
  }
};

export const getRichieste = async () => {
  try {
    await connectToDatabase();
    const richiesta = await Richiesta.find({});
    console.log(richiesta);
   
  } catch (error) {
    console.error("Errore durante il recupero della richiesta:", error);
    throw new Error("Errore nel recupero della richiesta");
  }
};

export const getRichiesteByEmail = async (emailUser: string, limit?: number) => {
  try {
    await connectToDatabase();
    const query = Richiesta.find({ emailUser: emailUser });
    if (limit) {
      query.limit(limit);
    }
    const richieste = await query.exec();
    console.log("Richieste trovate:", richieste);
    return richieste;
  } catch (error) {
    console.error(
      "Errore durante il recupero delle richieste:",
      error
    );
    throw new Error("Errore nel recupero delle richieste");
  }
};



export const getRichiestaSpecifica = async (emailMateriale: string, emailUser:string, nomeMateriale:string, distanza:string, misure?:string, image?:string,  finitura?: string) => {
  try {
    await connectToDatabase();
    const richiesta = await Richiesta.findOne({emailMateriale: emailMateriale, emailUser: emailUser, nomeMateriale: nomeMateriale, distanza: distanza, misure: misure, image: image, finitura: finitura});
    return richiesta;
  } catch (error) {
    console.error("Errore durante il recupero della richiesta:", error);
    throw new Error("Errore nel recupero della richiesta");
  }
};