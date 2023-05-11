import {
  Answer,
  Article,
  Content,
  Feedback,
  Participant,
  ParticipantProgress,
  Prisma,
} from '@prisma/client-platform';
import * as csv from 'csv';
import { getUnixTime } from 'date-fns';
import { writeFileSync } from 'node:fs';

import { FilePathMapping } from '@/pages/api/data';

import { prisma } from '@mbg/api-platform/lib/trpc/create-context';

type RemappedAnswer =
  | {
      [k in keyof Pick<
        Answer,
        'educationLevel' | 'englishLevel' | 'gender' | 'newsConsumption'
      >]: string;
    }
  | Answer;
type ExportableModel =
  | Feedback
  | Content
  | Participant
  | ParticipantProgress
  | Article
  | RemappedAnswer;

export function findManyResultToCsv<T extends ExportableModel[]>(
  findManyResult: T
) {
  return new Promise<string>((resolve) => {
    csv.stringify(
      findManyResult,
      {
        header: true,
        encoding: 'utf8',
        cast: {
          date: (value) => String(getUnixTime(value)),
          number: String,
          boolean: (value) => (value ? '1' : '0'),
        },
      },
      (err, data) => {
        if (err) {
          throw err;
        }
        resolve(data);
      }
    );
  });
}

export async function exportDataToLocalFs(filePathMapping: FilePathMapping) {
  async function write(modelName: Prisma.ModelName, data?: ExportableModel[]) {
    const fileString =
      data && data[0] ? await findManyResultToCsv(data) : 'no data';
    writeFileSync(filePathMapping[modelName]['filePath'], fileString);
  }

  await write(
    'Participant',
    await prisma['participant'].findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
  );

  await write(
    'ParticipantProgress',
    await prisma.participantProgress.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
  );

  await write(
    'Article',
    await prisma.article.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
  );

  await write('Content', await prisma.content.findMany());

  await write(
    'Feedback',
    await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
  );

  await write(
    'Answer',
    await prisma.answer.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
  );
}
