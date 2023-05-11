import { Participant } from '@prisma/client-platform';
import cryptoRandomString from 'crypto-random-string';
import { GetServerSideProps } from 'next';

import { prisma, prismaWrite } from '@mbg/api-platform/lib/trpc/create-context';

type ParticipantMiddleware = {
  participant: Participant;
};

export default function withParticipantAuthenticated<
  P extends { [key: string]: unknown }
>(
  contextFunction: (middleware: ParticipantMiddleware) => GetServerSideProps<P>
): GetServerSideProps<P> {
  const getServerSideProps: GetServerSideProps<P> = async (context) => {
    const storedUniqueIdentifier = context.req.cookies['uniqueIdentifier'];
    const uniqueUserIdentifier =
      storedUniqueIdentifier || calculateUniqueUserIdentifier();

    // Find the participant for the uui
    let participant = await prisma.participant.findUnique({
      where: {
        browserSignature: uniqueUserIdentifier,
      },
    });

    if (!participant) {
      participant = await prismaWrite.participant.create({
        data: {
          browserSignature: uniqueUserIdentifier,
        },
      });
    }

    if (!storedUniqueIdentifier) {
      // Set cookie
      context.res.setHeader(
        'Set-Cookie',
        `uniqueIdentifier=${uniqueUserIdentifier}; HttpOnly; Path=/; SameSite=Strict; ${
          process.env.NODE_ENV === 'production' ? 'Secure;' : ''
        }`
      );
    }

    const middleware = { participant };
    const ctx = await contextFunction(middleware)(context);

    if (!('props' in ctx)) {
      return {
        ...ctx,
        props: {},
      };
    }

    return {
      ...ctx,
      props: {
        ...(await ctx.props),
      },
    };
  };

  return getServerSideProps;
}

export const requireParticipantAuth = withParticipantAuthenticated(() => {
  return async () => {
    return {
      props: {},
    };
  };
});

const calculateUniqueUserIdentifier = () => {
  return cryptoRandomString({ length: 12, type: 'alphanumeric' });
};
