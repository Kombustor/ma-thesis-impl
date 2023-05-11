import cryptoRandomString from 'crypto-random-string';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { createSession } from '@/lib/create-session';

import {
  FeedbackMechanism,
  ParticipantSource,
} from '@mbg/api-platform/models/enums';

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  // If the prolific API token is set we only allow sessions with real prolific ids
  if (process.env.PROLIFIC_API_TOKEN) {
    return {
      redirect: {
        destination:
          '/error?error=PROLIFIC_API_TOKEN environment variable is set, can only join study via prolific',
        permanent: false,
      },
    };
  }

  // Generate a random 24 numbers pid and 12 alphanumeric characters sessionId
  const profileId = cryptoRandomString({ length: 24, type: 'numeric' });
  const sessionId = cryptoRandomString({ length: 12, type: 'alphanumeric' });

  const forcedMechanism = query.forcedMechanism as
    | FeedbackMechanism
    | undefined;

  // Create session and redirect
  return await createSession({
    res,
    profileId,
    sessionId,
    source: ParticipantSource.LOCAL_TESTING,
    feedbackMechanism: forcedMechanism,
  });
};

export default function GoPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  });

  return <>Redirecting...</>;
}
