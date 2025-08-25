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
    signIn: process.env.NEXT_PUBLIC_BASE_URL
      ? new URL("/login", process.env.NEXT_PUBLIC_BASE_URL).pathname
      : "/login", // redirección por defecto tras exigir login
  },
  trustHost: true, // necesario en Vercel para callbacks correctos
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
