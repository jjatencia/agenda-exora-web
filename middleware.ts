import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";

// Protege /agenda y subrutas usando NextAuth v5
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  
  // Si no hay sesión y está intentando acceder a /agenda
  if (!req.auth && pathname.startsWith("/agenda")) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    console.log("[MIDDLEWARE] Redirecting to login:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/agenda/:path*", "/:locale/agenda/:path*"],
};
