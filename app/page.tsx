import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  // Si hay sesión, ve a la zona privada; si no, al login
  redirect(session ? "/agenda" : "/login");
}
