import { getMagazzino } from "@/lib/actions/magazzino.action";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("sono dentro l'endpoint getMagazzino");
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Imposta la pagina (default: 1)
    const limit = parseInt(url.searchParams.get("limit") || "6", 10); // Imposta il limite (default: 6)

    const data = await getMagazzino();
    console.log("questo e quello che mi tira giu dal db: " + data);
    // console.log("questo e quello che mi tira giu dal db: " + data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Si è verificato un errore durante il recupero dei dati.",
      },
      { status: 500 }
    );
  }
}
