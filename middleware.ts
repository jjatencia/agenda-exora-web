import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware robusto: solo protege /(private) y nunca revienta la app.
export default async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { nextUrl } = req;

    // Solo proteger rutas bajo /(private)
    if (!token && nextUrl.pathname.startsWith("/(private)")) {
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
}

// Ejecutar SOLO en /(private) (evita tocar /, /login, /api, _next, etc.)
export const config = {
  matcher: ["/(private)(.*)"],
};
