import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/database";
import Users from "@/lib/database/models/user.model";
import {
  getUserSubscription,
  updateUserSubscription,
} from "@/lib/actions/user.action";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value; // Estrai il token dai cookie

    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET as string);
      await connectToDatabase();
      const user = JSON.parse(
        JSON.stringify(await Users.findOne({ email: (decoded as any).email }))
      );

      if (!user) {
        return NextResponse.json({ isAuthenticated: false }, { status: 401 });
      }

      const hasAccess = await getUserSubscription(user.email);
      if (!hasAccess) {
        return NextResponse.json({ isAuthenticated: false }, { status: 401 });
      }
      // Check if user account is older than 3 months and 1 day
      if (user.stripeDetails.payment_status === "free") {
        console.log("REGULAR CHECK FREE TRIAL 3 MONTHS");
        if (user.createdAt) {
          const createdAt = new Date(user.createdAt);
          const currentDate = new Date();

          // Calculate date 3 months and 1 day ago
          const threeMonthsAndOneDayAgo = new Date(currentDate);
          threeMonthsAndOneDayAgo.setMonth(
            threeMonthsAndOneDayAgo.getMonth() - 3
          );
          threeMonthsAndOneDayAgo.setDate(
            threeMonthsAndOneDayAgo.getDate() - 1
          );

          // Compare dates
          if (createdAt < threeMonthsAndOneDayAgo) {
            const users = await updateUserSubscription(
              user.email,
              {
                customerId: "",
                subscriptionId: "",
                priceId: "",
                status: "canceled",
                recurringSubScription: false,
                payment_status: "topay",
              },
              false
            );
            if (!users) {
              throw new Error("Utente non trovato");
            }
            return NextResponse.json(
              { isAuthenticated: false },
              { status: 401 }
            );
          }
        }
      }
      const userChanged = {
        email: user.email,
        tourSeen: user.TourSeen,
        fileBase64: user.fileBase64,
        indirizzo: user.indirizzo,
        nomeAzienda: user.nomeAzienda,
        minimumInsert: user.minimumInsert,
        telefono: user.telefono,
        password: user.password,
      };
      return NextResponse.json(
        { isAuthenticated: true, user: userChanged },
        { status: 200 }
      );
    } catch (err) {
      console.error("Errore durante la verifica del token:", err);
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
  } catch (err) {
    console.error("Errore del server:", err);
    return NextResponse.json({ message: "Errore del server" }, { status: 500 });
  }
}
