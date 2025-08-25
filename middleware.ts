import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Protege /agenda y subrutas. NO uses nombres de carpetas con () en el matcher.
export default auth((req) => {
  try {
    const { nextUrl } = req;
    if (!req.auth && nextUrl.pathname.startsWith("/agenda")) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch (err) {
    console.error("[MIDDLEWARE ERROR]", err);
    return NextResponse.next(); // nunca tirar 500
  }
});

export const config = {
  matcher: ["/agenda/:path*"],
};
