import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// NOTA: Sustituye esta función por la llamada real a tu backend.
// Debe devolver un objeto usuario { id, name, email } si credenciales válidas; o null si no.
async function authenticateViaBackend(email: string, password: string) {
  console.log("[BACKEND] Checking credentials:", { email, password });
  if (email === "admin@example.com" && password === "password") {
    console.log("[BACKEND] Credentials valid, returning user");
    return { id: "1", name: "Admin", email };
  }
  console.log("[BACKEND] Credentials invalid");
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
          console.log("[AUTH] Attempting login with:", { email: credentials?.email });
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          
          if (!email || !password) {
            console.log("[AUTH] Missing email or password");
            return null;
          }
          
          const user = await authenticateViaBackend(email, password);
          console.log("[AUTH] Authentication result:", user ? "success" : "failed");
          return user;
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
      console.log("[AUTH] Redirect callback:", { url, baseUrl });
      // Asegurar redirects seguros
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

