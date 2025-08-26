"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/agenda";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("[LOGIN ATTEMPT]", { email });
      
      // Usar redirect automático de NextAuth para evitar problemas de URL
      await signIn("credentials", {
        email,
        password,
        redirect: true, // Dejar que NextAuth maneje la redirección
      });
    } catch (error) {
      console.error("[LOGIN CATCH ERROR]", error);
      setError(`Error al iniciar sesión: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold">Acceder</h1>
        
        {error && (
          <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-30 text-secondary px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            className="w-full rounded-md border px-3 py-2 disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            className="w-full rounded-md border px-3 py-2 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md px-3 py-2 font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "#555BF6" }}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
