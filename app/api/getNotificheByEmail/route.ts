import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getNotificheByEmail } from "@/lib/actions/notifiche.action";

export async function POST(req: Request) {
  try {
    const { email, limit } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi sono obbligatori." },
        { status: 400 }
      );
    }

    const data = await getNotificheByEmail(email);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Errore durante la creazione:", error);
    return NextResponse.json(
      { success: false, message: "Si è verificato un errore." },
      { status: 500 }
    );
  }
}
