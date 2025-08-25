import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {

  try {
    const session = await auth();
    
    // Simplificar redirects - usar rutas relativas que son más confiables
    if (session) {
      redirect("/agenda");
    } else {
      redirect("/login");
    }
  } catch (error) {
    console.error("[HOME PAGE ERROR]", error);
    // Fallback seguro
    redirect("/login");
  }

}
