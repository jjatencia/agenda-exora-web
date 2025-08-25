import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth();
  const headerList = headers();
  const invokePath = headerList.get("x-invoke-path") || "/";
  const basePath = invokePath === "/" ? "" : invokePath.replace(/\/$/, "");
  redirect(`${basePath}${session ? "/agenda" : "/login"}`);
}
