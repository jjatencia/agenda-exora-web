import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth();
  const url = headers().get("x-url") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const base = url.endsWith("/") ? url : `${url}/`;
  const destination = new URL(session ? "agenda" : "login", base);
  redirect(destination.toString());
}
