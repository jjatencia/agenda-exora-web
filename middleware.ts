import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Middleware robusto: solo protege /(private) y nunca revienta la app.
export default auth((req) => {
  try {
    const { nextUrl } = req;

    // Solo proteger rutas bajo /(private)
    if (!req.auth && nextUrl.pathname.startsWith("/(private)")) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    // Nunca tirar 500 en middleware: log y continua
    console.error("[MIDDLEWARE ERROR]", err);
    return NextResponse.next();
  }
});

// Ejecutar SOLO en /(private) (evita tocar /, /login, /api, _next, etc.)
export const config = {
  matcher: ["/(private)(.*)"],
};
