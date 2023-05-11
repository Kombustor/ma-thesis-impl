import { ServerResponse } from 'node:http';

import { prisma } from '@mbg/api-platform/lib/trpc/create-context';
import {
  FeedbackMechanism,
  ParticipantSource,
  StudyProgress,
} from '@mbg/api-platform/models/enums';

type Props = {
  res: ServerResponse;
  source: ParticipantSource;
  profileId: string;
  sessionId: string;
  feedbackMechanism?: FeedbackMechanism;
};

export const createSession = async ({ res, ...props }: Props) => {
  // Create participant
  const createdParticipant = await prisma.participant.create({
    data: {
      ...props,
      progress: {
        create: {
          progress: StudyProgress.START_01,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return setSession(res, createdParticipant.id);
};

export const setSession = (res: ServerResponse, participantId: string) => {
  // Set cookie
  res.setHeader(
    'Set-Cookie',
    `participantSession=${participantId}; HttpOnly; Path=/; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`
  );

  return {
    props: {},
  };
};
