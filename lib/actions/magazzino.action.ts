"use server";

import { connectToDatabase } from "../database"; // Assicurati che questa connessione funzioni correttamente
import Magazzino from "@/lib/database/models/magazzino.action"; // Importa il modello Users
// materiale, nome, lunghezza, larghezza, spessore, immagine, email
export const updateMagazzino = async (
  _id: string,
  finitura: string,
  nome: string,
  lunghezza: number,
  larghezza: number,
  spessore: number,
  immagine: string,
  quantity: number,
) => {
  try {
    await connectToDatabase();

    const result = await Magazzino.findByIdAndUpdate(
      _id,
      {
        finitura,
        nome,
        lunghezza,
        larghezza,
        spessore,
        immagine,
        quantity,
      },
      { new: true }
    );

    if (!result) throw new Error("Errore nel aggiornamento del Magazzino");
    return result;
  } catch (error) {
    console.error("Errore durante l'aggiornamento del magazzino", error);
    throw new Error("Errore durante l'aggiornamento del magazzino");
  }
};
export const insertMagazzino = async (
  finitura: string,
  nome: string,
  lunghezza: number,
  larghezza: number,
  spessore: number,
  immagine: string,
  email: string,
  quantity: number
) => {
  try {
    await connectToDatabase(); // Connessione al database

    const newMagazzino = new Magazzino({
      finitura,
      nome,
      lunghezza,
      larghezza,
      immagine,
      spessore,
      email,
      quantity
    });

    await newMagazzino.save();
    console.log("Nuovo oggetto nel magazzino creato:", newMagazzino);
    return newMagazzino;
  } catch (error) {
    console.error(
      "Errore durante l'inserimento dell'oggetto nel magazzino:",
      error
    );
    throw new Error("Errore durante l'inserimento dell'oggetto nel magazzino");
  }
};

export const getMagazzino = async () => {
  try {
    console.log("sono dentro la funzione");
    await connectToDatabase();
    const magazzino = await Magazzino.find();
    console.log("questo e il magazzino: " + magazzino);
    return magazzino;
  } catch (error) {
    console.error(
      "Errore durante il recupero dell'oggetto nel magazzino:",
      error
    );
    throw new Error("Errore nel recupero dell'oggetto nel magazzino");
  }
};

export const deleteMagazzino = async (id: string) => {
  try {
    await connectToDatabase();

    const result = await Magazzino.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Oggetto non trovato nel magazzino");
    }
    return result;
  } catch (error) {
    console.error(
      "Errore durante l'eliminazione dell'oggetto nel magazzino:",
      error
    );
    throw new Error("Errore durante l'eliminazione dell'oggetto nel magazzino");
  }
};
export const getMagazzinoByEmail = async (email: string, limit?: number) => {
  try {
    await connectToDatabase();
    const query = Magazzino.find({ email: email }).sort({ createdAt: -1 });
    if (limit) {
      query.limit(limit);
    }
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


export const getAllMagazzino = async () => {
  try {
    await connectToDatabase();
    const material = await Magazzino.find();
    return material;
  } catch (error) {
    console.error("Errore durante il recupero del materiae:", error);
    throw new Error("Errore nel recupero del materiale");
  }
};

export const getMagazzinoByFinitura = async (finitura: string) => {
  try {
    console.log("finitura action: " + finitura);  
    await connectToDatabase();
    const material = await Magazzino.find({finitura: finitura});
    return material;
  } catch (error) {
    console.error("Errore durante il recupero del materiae:", error);
    throw new Error("Errore nel recupero del materiale");
  }
};
