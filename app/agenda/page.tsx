// Página privada principal (agenda). Server Component.
export const dynamic = 'force-dynamic';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AgendaClient from "./AgendaClient";

export default async function AgendaPage() {
  try {
    const session = await auth();
    
    if (!session) {
      console.log("[AGENDA] No session found, redirecting to login");
      redirect("/login");
    }

    return <AgendaClient userEmail={session.user?.email} />;
  } catch (error) {
    console.error("[AGENDA ERROR]", error);
    redirect("/login");
  }
}
