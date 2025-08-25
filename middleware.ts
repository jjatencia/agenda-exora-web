import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protege /agenda y subrutas. NO uses nombres de carpetas con () en el matcher.
export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;
    
    // Simplificar la lógica del middleware
    if (!token && pathname.startsWith("/agenda")) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      console.log("[MIDDLEWARE] Redirecting to login:", loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  } catch (err) {
    console.error("[MIDDLEWARE ERROR]", err);
    // En caso de error, redirigir al login como fallback seguro
    if (req.nextUrl.pathname.startsWith("/agenda")) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/agenda/:path*", "/:locale/agenda/:path*"],
};
