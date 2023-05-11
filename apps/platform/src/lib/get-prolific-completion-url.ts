import { prisma } from '@mbg/api-platform/lib/trpc/create-context';
import { ProlificCompletionCodeEvent } from '@mbg/api-platform/models/enums';

export default async function getProlificCompletionUrl<T>(
  event: ProlificCompletionCodeEvent,
  props?: T
) {
  // If no event is provided, get the default url
  const prolificCompletionCode = await prisma.prolificCompletionCode.findUnique(
    {
      where: { event },
    }
  );
  // Is the provided event not configured in the db?
  if (!prolificCompletionCode) {
    // If prolific api token is not set (debugging environments), fail silently
    return process.env['PROLIFIC_API_TOKEN']
      ? {
          redirect: {
            destination:
              '/error?error=Wrong system configuration, please notify the creators of the study. Error: prolific completion code not set.',
            permanent: false,
          },
        }
      : {
          props: { ...props },
        };
  }

  return {
    props: {
      prolificUrl: `${process.env['PROLIFIC_STUDY_COMPLETE_ENDPOINT']}${prolificCompletionCode.code}`,
      ...props,
    },
  };
}
