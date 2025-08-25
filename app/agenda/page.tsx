// Página privada principal (agenda). Server Component.
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AgendaPage() {
  try {
    const session = await auth();
    
    if (!session) {
      console.log("[AGENDA] No session found, redirecting to login");
      redirect("/login");
    }

    // TODO: si ya tienes componentes (DateHeader, CardCarousel, etc.), impórtalos aquí.
    return (
      <main className="p-4">
        <h1 className="text-xl font-semibold">Agenda</h1>
        <p className="text-sm opacity-80">Aquí irá el carrusel de citas del día.</p>
        <div className="mt-4 text-xs opacity-60">
          Sesión activa para: {session.user?.email}
        </div>
      </main>
    );
  } catch (error) {
    console.error("[AGENDA ERROR]", error);
    redirect("/login");
  }
}
