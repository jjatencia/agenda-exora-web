export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  // NO devuelvas secretos, solo si existen o no
  const hasSecret = Boolean(process.env.NEXTAUTH_SECRET);
  const hasUrl = Boolean(process.env.NEXTAUTH_URL);

  return NextResponse.json({
    ok: true,
    env: {
      NEXTAUTH_SECRET: hasSecret ? "present" : "missing",
      NEXTAUTH_URL: hasUrl ? "present" : "missing",
    },
    time: new Date().toISOString(),
  });
}
