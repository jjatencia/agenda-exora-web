export const dynamic = 'force-dynamic';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  try {
    const session = await auth();
    if (session) {
      redirect("/agenda");
    } else {
      redirect("/login");
    }
  } catch (error) {
    console.error("[HOME PAGE ERROR]", error);
    redirect("/login");
  }
}
