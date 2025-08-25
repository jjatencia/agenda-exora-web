import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (
          credentials?.email === 'admin@example.com' &&
          credentials.password === 'password'
        ) {
          return { id: '1', name: 'Admin', email: credentials.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
