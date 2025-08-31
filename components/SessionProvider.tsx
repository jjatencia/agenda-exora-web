"use client";

import { useEffect } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  // PWA updater: cuando el SW toma control (nueva versión), recargar una vez
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      const handler = () => {
        if (!(window as any)._reloadedDueToSW) {
          (window as any)._reloadedDueToSW = true;
          window.location.reload();
        }
      };
      navigator.serviceWorker.addEventListener("controllerchange", handler);
      return () => navigator.serviceWorker.removeEventListener("controllerchange", handler);
    }
  }, []);

  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}