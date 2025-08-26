import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// NOTA: Sustituye esta función por la llamada real a tu backend.
// Debe devolver un objeto usuario { id, name, email } si credenciales válidas; o null si no.
async function authenticateViaBackend(email: string, password: string) {
  if (email === "admin@example.com" && password === "password") {
    return { id: "1", name: "Admin", email };
  }
  return null;
}

const config: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          console.log("[AUTH ATTEMPT]", { email: credentials?.email });
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          
          if (!email || !password) {
            console.error("[AUTH ERROR]", "Missing credentials");
            return null;
          }
          
          const user = await authenticateViaBackend(email, password);
          console.log("[AUTH RESULT]", user ? "Success" : "Failed");
          return user; // si null → login falla
        } catch (error) {
          console.error("[AUTH ERROR]", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("[AUTH REDIRECT]", { url, baseUrl });
      
      // Siempre redirigir a la agenda después del login exitoso
      return "/agenda";
    },
    async session({ session, token }) {
      // Asegurar que la sesión tenga los datos necesarios
      if (token?.sub && session.user) {
        session.user.id = token.sub;

      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  debug: true, // Temporal: habilitar debug en producción para diagnosticar
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

