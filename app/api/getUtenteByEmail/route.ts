import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUtenteByEmail } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  try {
    console.log("richiesta di accesso a getUtenteByEmail");
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi sono obbligatori." },
        { status: 400 }
      );
    }

    const data = await getUtenteByEmail(email);
    console.log("utente trovato: ", data);
    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("Errore durante la creazione:", error);
    return NextResponse.json(
      { success: false, message: "Si è verificato un errore." },
      { status: 500 }
    );
  }
}