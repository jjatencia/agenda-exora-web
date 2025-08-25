import { signIn } from "@/auth";
import Link from "next/link";

export default function LoginPage() {
  async function doLogin(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    await signIn("credentials", { email, password, redirectTo: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-complement3 p-4">
      <form action={doLogin} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-heading text-primary">Iniciar sesión</h1>
        <label className="block">
          <span className="text-sm">Email</span>
          <input name="email" type="email" required className="mt-1 w-full border p-2 rounded" />
        </label>
        <label className="block">
          <span className="text-sm">Contraseña</span>
          <input name="password" type="password" required className="mt-1 w-full border p-2 rounded" />
        </label>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">
          Entrar
        </button>
        <p className="text-center text-sm">
          <Link href="/" className="underline">
            Volver
          </Link>
        </p>
      </form>
    </div>
  );
}
