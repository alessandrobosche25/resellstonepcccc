import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Add this array of API endpoints that are exempt from the middleware
const apiExceptions = [
  "/api/check-auth", // Allow auth check endpoint to work without a valid token
  "/api/getTokenByEmail", // Allow this endpoint to be called during auth process
  "/api/createStatistiche",
];

// Add this array for public pages that should be accessible without authentication
const publicPages = [
  "/",
  "error",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If path is in exceptions, let it pass through
  if (apiExceptions.includes(pathname)) {
    return NextResponse.next();
  }

  // If path is a public page, let it pass through
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  const protectedRoutes = ["/home","/addProducts","/help","/profilo","/notifiche","/impostazioni","/admin","/admin/utenti","/admin/abbonamenti","/admin/prodotti","/admin/monitoraggio","/ricerca","/preferiti","/fornitore","/statistiche","/boost"];

  if (protectedRoutes.includes(pathname)) {
    console.log("ora sono in:", pathname);
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("Token mancante. Redirezione a /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      (req as any).session = payload.email;

      // 🔵 Controllo scadenza token
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiration = payload.exp || 0;
      const timeLeft = tokenExpiration - currentTime;

      if (timeLeft < 5 * 60) {
        // Genera un nuovo access token
        const newAccessToken = jwt.sign(
          { id: payload.id, email: payload.email },
          JWT_SECRET,
          { expiresIn: "15m" }
        );

        // Setta il nuovo token nei cookie
        const response = NextResponse.next();
        response.cookies.set("token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 3600 * 24 * 7, // 1 settimana
        });

        return response;
      }

      // Add explicit return for valid token
      return NextResponse.next();
    } catch (error) {
      console.error("Token non valido:", error);
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.set("token", "", { expires: new Date(0) });
      return response;
    }
  }

  return NextResponse.next();
}
