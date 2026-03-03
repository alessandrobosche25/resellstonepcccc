import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { deleteNotifica } from "@/lib/actions/notifiche.action";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    console.log("id-----------------------------------: ", id);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi sono obbligatori." },
        { status: 400 }
      );
    }

    await deleteNotifica(id);
    return NextResponse.json(
      {
        success: true,
        message: "Eliminato con successo!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore durante l'eliminazione:", error);
    return NextResponse.json(
      { success: false, message: "Si è verificato un errore." },
      { status: 500 }
    );
  }
}
