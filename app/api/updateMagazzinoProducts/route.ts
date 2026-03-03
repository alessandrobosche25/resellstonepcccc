"use server";
import { updateMagazzino } from "@/lib/actions/magazzino.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, finitura, nome, lunghezza, larghezza, spessore, immagine, quantity } =
      await req.json();
    console.log(id, finitura, nome, lunghezza, larghezza, spessore, quantity);
    if (
      !id ||
      !finitura ||
      !nome ||
      !lunghezza ||
      !larghezza ||
      !spessore ||
      !immagine ||
      !quantity
    ) {
      return NextResponse.json({
        status: 422,
        message: "Tutti i campi sono obbligatori",
      });
    }

    const magazzino = await updateMagazzino(
      id,
      finitura,
      nome,
      lunghezza,
      larghezza,
      spessore,
      immagine,
      quantity,
    );
    if (!magazzino) {
      return NextResponse.json({
        status: 500,
        message: "C'è stato un errore nell'aggiornamento del prodotto",
      });
    }
    return NextResponse.json({
      status: 200,
      message: "Prodotto aggiornato correttamente",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Errore del server",
    });
  }
}