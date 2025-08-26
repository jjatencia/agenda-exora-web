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
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          const user = email && password ? await authenticateViaBackend(email, password) : null;
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
    signIn: "/login", // Usar ruta relativa siempre
    error: "/login", // Redirigir errores al login
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Asegurar redirects seguros
      console.log("[AUTH REDIRECT]", { url, baseUrl });
      
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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

