"use server";

import { connectToDatabase } from "../database"; // Assicurati che questa connessione funzioni correttamente
import Users from "../database/models/user.model";
import bcrypt from "bcryptjs";

export const insertUtente = async (
  nomeAzienda: string,
  indirizzo: string,
  telefono: string,
  email: string,
  password: string,
  fileBase64: string,
  token: string,
  hasAccess: boolean,
  stripeDetails?: {
    customerId: string;
    subscriptionId: string;
    priceId: string;
  },
  minimumInsert: boolean = false
) => {
  try {
    const TourSeen: boolean = false;
    await connectToDatabase(); // Connessione al database
    const newUser = new Users({
      nomeAzienda,
      email,
      indirizzo,
      telefono,
      password,
      fileBase64,
      TourSeen,
      token,
      hasAccess,
      stripeDetails,
      minimumInsert,
    });

    await newUser.save();
    console.log("Nuovo utente creato:", newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Errore durante l'inserimento dell'utente:", error);
    throw new Error("Errore durante l'inserimento dell'utente");
  }
};

export const getUtente = async () => {
  try {
    await connectToDatabase();
    const utente = await Users.findOne();
    // console.log(utente);
    return utente;
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    throw new Error("Errore nel recupero dell'utente");
  }
};

export const updateInsertUtente = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await Users.findOneAndUpdate(
      { email },
      {
        $set: {
          minimumInsert: true,
        },
      },
      { new: true }
    );
    if (!user) throw new Error("Errore nel aggiornamento dell'utente");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Errore durante la modifica degl'utente:", error);
    throw new Error("Errore durante la modifica dell'utente");
  }
};

export const getUtenteByEmail = async (email: string[]) => {
  try {
    await connectToDatabase();

    // Usa l'operatore $in per cercare più email
    const utenti = await Users.find(
      { email: { $in: email } },
      { password: 0, stripeDetails: 0 }
    );

    return utenti; // Restituisce un array di utenti
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error);
    throw new Error("Errore nel recupero degli utenti");
  }
};
export const getUserSubscription = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await Users.findOne({ email: email });
    return (user as any).hasAccess;
  } catch (error) {}
};
export const getUserSubscriptionID = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await Users.findOne({ email: email });
    // console.log(user);
    return (user as any).stripeDetails;
  } catch (error) {}
};
export const updateUserAccess = async (email: string, access: boolean) => {
  try {
    await connectToDatabase();
    const userAccess = await Users.updateOne(
      { email: email },
      { hasAccess: access }
    );
    if (!userAccess)
      return new Error("Errore nel aggiornamento del accesso utente");
  } catch (error) {
    console.error("Internal Server error : ", error);
    throw new Error("Internal Server error");
  }
};
export const aggiornaToken = async (NewToken: string, email: string) => {
  try {
    await connectToDatabase();
    console.log("nuovo token", NewToken);
    console.log("mail", email);
    const user = await Users.findOneAndUpdate(
      { email },
      { $set: { token: NewToken } },
      { new: true }
    );
    if (!user) throw new Error("Errore nel aggiornamento del token");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Errore durante l'aggiornamento del token.");
  }
};

export const getUtenteByEmailString = async (email: string) => {
  try {
    await connectToDatabase();
    const utenti = await Users.findOne({ email: email });
    return utenti; // Restituisce un array di utenti
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error);
    throw new Error("Errore nel recupero degli utenti");
  }
};
export const updateUserSubscription = async (
  email: string,
  stripeDetails: any,
  hasAccess: boolean
) => {
  try {
    await connectToDatabase();
    console.log("Dettagli STripe :  ", { email, hasAccess, stripeDetails });

    const user = await Users.findOneAndUpdate(
      { email },
      {
        $set: {
          hasAccess,
          stripeDetails,
        },
      },
      { new: true }
    );
    if (!user) throw new Error("Errore nel aggiornamento dell'utente");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Errore durante l'aggiornamento dell'utente.");
  }
};
// Aggiungi questa nuova funzione
export async function getUserByCustomerId(customerId: string) {
  try {
    // Connessione al database
    await connectToDatabase();
    // Cerca l'utente con il customerId specificato
    console.log(" customer ID da actions", customerId);
    const user = await Users.findOne({
      "stripeDetails.customerId": customerId,
    });

    if (!user) {
      throw new Error("Utente non trovato");
    }
    console.log(user);
    return user.email;
  } catch (error) {
    console.error("Error retrieving user by customerId:", error);
    throw error;
  }
}
export const updateRecurringSub = async (
  email: string,
  recurringSubScription: boolean
) => {
  try {
    await connectToDatabase();
    console.log("ACTION : ", recurringSubScription);
    const user = await Users.updateOne(
      { email },
      {
        $set: { "stripeDetails.recurringSubScription": recurringSubScription },
      },
      { new: true }
    );
    if (!user) throw new Error("Errore nel aggiornamento dell'utente");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error(
      "Errore durante l'aggiornamento del abbonamento ricorrente dell'utente."
    );
  }
};
export const checkAccess = async (email: string) => {
  try {
    await connectToDatabase();
    // Usa l'operatore $in per cercare più email
    const utenti = await Users.findOne({ email: email });

    return utenti.hasAccess;
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error);
    throw new Error("Errore nel recupero degli utenti");
  }
};

export const getAllUtenti = async () => {
  try {
    await connectToDatabase();
    const utente = await Users.find();
    // console.log(utente);
    return utente;
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    throw new Error("Errore nel recupero dell'utente");
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log("Avvio autenticazione...");

    await connectToDatabase();

    const utente = await Users.findOne({ email: email });
    // console.log(utente);
    if (!utente) {
      throw new Error("Utente non trovato nel database.");
    }

    if (utente.email === email) {
      console.log("Email corretta!");
      const match = await bcrypt.compare(password, utente.password);
      if (match) {
        console.log("Password corretta!");
        return JSON.parse(JSON.stringify(utente));
      } else {
        console.log("Password errata.");
        return;
      }
    } else {
      throw new Error("Credenziali non validi !!!");
    }
  } catch (error) {
    console.error("Errore durante l'autenticazione:", error);
    throw new Error("Errore durante l'autenticazione.");
  }
};

export const tourUpdate = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await Users.findOneAndUpdate(
      { email },
      { $set: { TourSeen: true } },
      { new: true }
    );
    if (!user) throw new Error("Errore nel aggiornamento del tour");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Errore durante l'aggiornamento dell'utente.");
  }
};

export const getTokenByEmail = async (email: string) => {
  try {
    await connectToDatabase();
    console.log("email token ------------------", email);
    // Usa l'operatore $in per cercare più email
    const utenti = await Users.findOne({ email: email });

    return utenti.token; // Restituisce un array di utenti
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error);
    throw new Error("Errore nel recupero degli utenti");
  }
};

export const userUpdate = async (
  nomeAzienda: string,
  indirizzo: string,
  telefono: string,
  email: string,
  password: string,
  newpwd: string,
  fileBase64: string
) => {
  try {
    await connectToDatabase();

    const user = await Users.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    if (password != "") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }
    }
    const updateData: any = {
      nomeAzienda,
      indirizzo,
      telefono,
      fileBase64,
    };

    if (newpwd && password != "") {
      updateData.password = await bcrypt.hash(newpwd, 10);
    }
    const updatedUser = await Users.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'utente:", error);
    throw new Error("Errore durante l'aggiornamento dell'utente.");
  }
};
