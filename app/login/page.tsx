"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("[LOGIN] Attempting login for:", email);

    try {
      // Hacer el login usando fetch directamente
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
          csrfToken: await getCsrfToken(),
        }),
        credentials: "include", // Importante para las cookies
      });

      console.log("[LOGIN] Response status:", response.status);
      
      if (response.ok) {
        console.log("[LOGIN] Success! Redirecting to /agenda");
        router.push("/agenda");
      } else if (response.status === 401) {
        setError("Credenciales inválidas");
      } else if (response.status === 302) {
        // Redirección - probablemente éxito
        router.push("/agenda");
      } else {
        setError("Error en el servidor");
      }
    } catch (error) {
      console.error("[LOGIN ERROR]", error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }

  async function getCsrfToken() {
    try {
      const response = await fetch("/api/auth/csrf");
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Error getting CSRF token:", error);
      return "";
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold">Acceder</h1>
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
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
