"use client";

import { signIn } from "@/auth";
import { useFormState } from "react-dom";

type LoginState = {
  error?: string;
};

async function doLogin(prevState: LoginState, formData: FormData): Promise<LoginState> {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/agenda" });
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de autenticación";
    return { error: message };
  }
}

export default function LoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(doLogin, {});

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form action={formAction} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold">Acceder</h1>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        {state.error && (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 font-medium text-white"
          style={{ backgroundColor: "#555BF6" }}
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
