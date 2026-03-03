import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  checkAccess,
  getUserSubscriptionID,
  signIn,
  updateUserSubscription,
} from "@/lib/actions/user.action";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      daysLeft,
    }: { email: string; password: string; daysLeft: number } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email e password sono obbligatorie" },
        { status: 400 }
      );
    }

    const user = await signIn(email, password);
    // console.log(user);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email o password errate" },
        { status: 401 }
      );
    }

    const hasAccess = await checkAccess(email);
    const status = await getUserSubscriptionID(email);
    if (!hasAccess) {
      console.log("giorni mancanti : ", daysLeft);
      if (daysLeft === 0 || status.payment_status === "topay") {
        console.log("zero o meno.. pagamento");
        return NextResponse.json(
          { redirectTo: "/subscription" },
          { status: 403 }
        );
      } else if (daysLeft > 0) {
        // Allow login but indicate payment page redirect is needed
        console.log("sufficienti rimani e gratis");
        const user = await updateUserSubscription(
          email,
          {
            customerId: "",
            subscriptionId: "",
            priceId: "",
            status: "active",
            recurringSubScription: false,
            payment_status: "free",
          },
          true
        );
        if (!user) {
          throw new Error("Utente non trovato");
        }
        const payload = {
          id: user.id,
          email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        const response = NextResponse.json(
          {
            success: true,
            message: "Login effettuato con successo",
            user: { id: user.id, email: user.email },
          },
          { status: 200 }
        );

        response.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 3600 * 24 * 7,
        });

        return response;
      }
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login effettuato con successo",
        user: { id: user.id, email: user.email },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Errore durante il login:", error);

    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
