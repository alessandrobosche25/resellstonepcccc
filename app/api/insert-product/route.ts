import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { insertMagazzino } from "@/lib/actions/magazzino.action";

export async function POST(req: Request) {
  try {
    let { finitura = "0", nome, lunghezza, larghezza, spessore, immagine, email, quantity } =
      await req.json();
      // console.log( finitura = "0", nome, lunghezza, larghezza, spessore, immagine, email, quantity)
    if(finitura == '') finitura = '0';
    if (
      !finitura ||
      !nome ||
      !lunghezza ||
      !larghezza ||
      !spessore ||
      !immagine ||
      !email||
      !quantity
    ) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi sono obbligatori." },
        { status: 400 }
      );
    }

    await insertMagazzino(
      finitura,
      nome,
      lunghezza,
      larghezza,
      spessore,
      immagine,
      email,
      quantity
    );
    return NextResponse.json(
      {
        success: true,
        message: "Creato con successo!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore durante la creazione:", error);
    return NextResponse.json(
      { success: false, message: "Si è verificato un errore." },
      { status: 500 }
    );
  }
}