import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { createSession, setSession } from '@/lib/create-session';

import { prisma } from '@mbg/api-platform/lib/trpc/create-context';
import { ParticipantSource } from '@mbg/api-platform/models/enums';

type ProlificQuery = {
  PROLIFIC_PID: string;
  SESSION_ID: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  if (!process.env.PROLIFIC_API_TOKEN) {
    return {
      redirect: {
        destination:
          '/error?error=PROLIFIC_API_TOKEN environment variable is not set, cannot use this entry point',
        permanent: false,
      },
    };
  }

  // Parse prolific query params
  const prolificQuery: ProlificQuery = query as ProlificQuery;

  // If (some) query params are missing, show error
  if (!prolificQuery.PROLIFIC_PID || !prolificQuery.SESSION_ID) {
    return {
      redirect: {
        destination:
          '/error?error=Invalid params, please try re-joining from Prolific and make sure PROLIFIC_PID and SESSION_ID query parameters are set',
        permanent: false,
      },
    };
  }

  const existingParticipant = await prisma.participant.findFirst({
    where: {
      profileId: prolificQuery.PROLIFIC_PID,
    },
  });

  // eslint-disable-next-line unicorn/prefer-ternary
  if (!existingParticipant) {
    // Create session and redirect
    return await createSession({
      res,
      profileId: prolificQuery.PROLIFIC_PID,
      sessionId: prolificQuery.SESSION_ID,
      source: ParticipantSource.PROLIFIC,
    });
  }

  // Otherwise set existing session
  return setSession(res, existingParticipant.id);
};

export default function ProlificPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  });

  return <>Redirecting...</>;
}
