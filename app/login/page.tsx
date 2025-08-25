import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { error?: string, callbackUrl?: string } }) {
  const error = searchParams?.error;
  const callbackUrl = searchParams?.callbackUrl || "/agenda";

  async function handleLogin(formData: FormData) {
    "use server";
    
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
      console.log("[LOGIN] Attempting login for:", email);
      
      const result = await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
      });
      
      console.log("[LOGIN] SignIn result:", result);
    } catch (error: any) {
      console.error("[LOGIN ERROR]", error);
      
      // NextAuth v5 throws redirect errors, check if it's actually an error
      if (error?.type === "CredentialsSignin") {
        redirect(`/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      
      // Re-throw other errors to let NextAuth handle them
      throw error;
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form action={handleLogin} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold">Acceder</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error === "CredentialsSignin" ? "Credenciales inválidas" : "Error al iniciar sesión"}
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
            defaultValue="admin@example.com"
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
            defaultValue="password"
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
