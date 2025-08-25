import { signIn } from "@/auth";

export default function LoginPage() {
  async function doLogin(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const redirectTo = "/agenda";
    await signIn("credentials", { email, password, redirectTo });
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form action={doLogin} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
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
