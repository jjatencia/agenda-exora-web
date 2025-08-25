import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protege /agenda y subrutas. NO uses nombres de carpetas con () en el matcher.
export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req });
    const { nextUrl } = req;
    const basePath = `${nextUrl.basePath}${
      nextUrl.locale !== nextUrl.defaultLocale ? `/${nextUrl.locale}` : ""
    }`;
    if (!token && nextUrl.pathname.startsWith(`${basePath}/agenda`)) {
      const url = new URL(`${basePath}/login`, nextUrl);
      url.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch (err) {
    console.error("[MIDDLEWARE ERROR]", err);
    return NextResponse.next(); // nunca tirar 500
  }
}

export const config = {
  matcher: ["/agenda/:path*", "/:locale/agenda/:path*"],
};
