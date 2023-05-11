import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import { NextAuthOptions, SessionStrategy } from 'next-auth';
import { Provider } from 'next-auth/providers';
import EmailProvider from 'next-auth/providers/email';

import { prisma } from '@mbg/api-platform/lib/trpc/create-context';

if (!process.env.SECRET) {
  throw new Error('SECRET is not defined');
}

const commonOptions = {
  server: process.env.EMAIL_SERVER,
  from: process.env.EMAIL_FROM,
  maxAge: 10 * 60, // Magic links are valid for 10 min only
  secret: process.env.SECRET,
};

const defaultEmailProvider = EmailProvider(commonOptions);

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const providers: Provider[] = [
  EmailProvider({
    ...commonOptions,
    async sendVerificationRequest(params) {
      if (process.env.EMAIL_SERVER) {
        await defaultEmailProvider.sendVerificationRequest(params);
      } else if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] Login link:', params.url);
      } else {
        throw new Error('No email server configured');
      }
    },
  }),
];

const nextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: providers,
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 24 * 60 * 60, // Session is invalidated after one day
  },
  jwt: {
    secret: process.env.SECRET,
  },
  // pages: {
  //   signIn: '/auth/signin', // Displays signin buttons
  //   signOut: '/auth/signout', // Displays form with sign out button
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // Displays form with email and button to send magic link
  // },
  debug: false,
  callbacks: {
    async signIn({ user, email }) {
      if (email.verificationRequest) {
        const whitelistEntry = await prisma.emailWhitelist.findUnique({
          where: { email: user.email ?? '' },
        });
        return !!whitelistEntry;
      }
      return true;
    },
  },
} as NextAuthOptions;

export default NextAuth({ ...nextAuthConfig });
