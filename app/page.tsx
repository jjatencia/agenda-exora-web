import { redirect } from "next/navigation";

export default function Home() {
  // Simplemente redirige al login, el middleware se encarga de proteger /agenda
  redirect("/login");
}