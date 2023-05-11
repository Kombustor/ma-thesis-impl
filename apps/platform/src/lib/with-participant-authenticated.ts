import { Participant, StudyProgress } from '@prisma/client-platform';
import { GetServerSideProps } from 'next';

import { prisma } from '@mbg/api-platform/lib/trpc/create-context';

const redirectObject = {
  redirect: {
    destination:
      '/error?error=Invalid session, please try clearing your cookies and re-joining from Prolific',
    permanent: false,
  },
};

type ParticipantMiddleware = {
  participant: Participant & {
    studyProgress: StudyProgress;
  };
};

export const loadParticipant = async (id: string) => {
  const p = await prisma.participant.findUnique({
    where: {
      id,
    },
    include: {
      progress: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        where: {
          participantId: id,
        },
      },
    },
  });

  if (!p || !p.progress[0]) {
    return;
  }

  return { ...p, studyProgress: p.progress[0].progress };
};

export default function withParticipantAuthenticated<
  P extends { [key: string]: unknown }
>(
  contextFunction: (middleware: ParticipantMiddleware) => GetServerSideProps<P>
): GetServerSideProps<P> {
  const getServerSideProps: GetServerSideProps<P> = async (context) => {
    const id = context.req.cookies['participantSession'];
    if (!id) {
      return redirectObject;
    }

    const participant = await loadParticipant(id);

    if (!participant) return redirectObject;
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
