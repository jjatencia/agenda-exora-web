import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// NOTA: Sustituye esta función por la llamada real a tu backend.
// Debe devolver un objeto usuario { id, name, email } si credenciales válidas; o null si no.
async function authenticateViaBackend(email: string, password: string) {
  if (email === "admin@example.com" && password === "password") {
    return { id: "1", name: "Admin", email };
  }
  return null;
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET no está definido en las variables de entorno");
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error("NEXTAUTH_URL no está definido en las variables de entorno");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const user = email && password ? await authenticateViaBackend(email, password) : null;
        return user; // si null → login falla
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // redirección por defecto tras exigir login
  },
  trustHost: true, // necesario en Vercel para callbacks correctos
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
