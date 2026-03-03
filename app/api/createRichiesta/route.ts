import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { insertRichiesta } from "@/lib/actions/richieste.action";

export async function POST(req: Request) {
  try {
    const { emailMateriale, emailUser, nomeMateriale, distanza,misure,image,finitura } =
      await req.json();
    console.log("email dal server del materiale: " + emailMateriale);
    if (!emailMateriale || !emailUser || !nomeMateriale || !distanza) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi sono obbligatori." },
        { status: 400 }
      );
    }

    //const data = await getRichiestaSpecifica(nome, email);
    //console.log("risultato di getRichiestaSpecifica: ", data);
    /*
    if(data != null){
      return NextResponse.json(
        { success: false, message: "Richiesta gia esistente" },
        { status: 400 }
      );
    }
    else{
      await insertRichiesta(
        nome,
        email,
        finitura,
      );
      return NextResponse.json(
        {
          success: true,
          message: "Richiesta inserita con successo!",
        },
        { status: 200 }
      );
    }
      */
    await insertRichiesta(
      emailMateriale,
      emailUser,
      nomeMateriale,
      distanza,
      misure,
      image,
      finitura
    );
    return NextResponse.json(
      {
        success: true,
        message: "Richiesta inserita con successo!",
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
