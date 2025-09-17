import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function authenticateViaBackend(email: string, password: string) {
  try {
    const response = await fetch('https://api.exora.app/api/auth/ext-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Store the token for future requests
    return {
      id: data.id || data.userId || email,
      name: data.name || data.nombre || email.split('@')[0],
      email,
      token: data.token || data.accessToken
    };
  } catch (error) {
    console.error('Login API error:', error);
    return null;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
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
  session: { 
    strategy: "jwt" as const 
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };