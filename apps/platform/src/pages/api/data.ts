import { Prisma } from '@prisma/client-platform';
import archiver from 'archiver';
import cryptoRandomString from 'crypto-random-string';
import { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream, rmSync, rmdirSync } from 'node:fs';

import { createTmpFolder } from '@/lib/create-tmp-folder';
import { exportDataToLocalFs } from '@/lib/export-data-to-local-fs';

import { getUserById } from '@mbg/api-platform/lib/get-user-by-id';
import { getSessionFromCookie } from '@mbg/api-platform/lib/trpc/create-context';

const { Answer, Article, Content, Participant, ParticipantProgress, Feedback } =
  Prisma.ModelName;

export type FilePathMapping = {
  [k in Prisma.ModelName]: { filePath: string; fileName: string };
};

const route = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed.');
  }

  const session = await getSessionFromCookie({ req });
  const user = await getUserById(session?.user.id);
  if (!user || !session) {
    return res.status(401).send('Not authorized.');
  }

  res.setHeader(
    'Content-disposition',
    `attachment; filename=data-export_${Date.now()}.zip`
  );
  res.setHeader('Content-type', 'text/zip');
  const tmpFolder = createTmpFolder();

  const filePathMapping = Object.fromEntries(
    [Answer, Article, Content, Participant, ParticipantProgress, Feedback].map(
      (x: Prisma.ModelName) => {
        const fileName = cryptoRandomString({
          length: 12,
          type: 'alphanumeric',
        });
        return [x, { filePath: `${tmpFolder}/${fileName}`, fileName }];
      }
    )
  ) as FilePathMapping;

  await exportDataToLocalFs(filePathMapping);
  const archive = archiver('zip', { zlib: { level: 9 } });

  for (const [key, { filePath }] of Object.entries(filePathMapping)) {
    archive.append(createReadStream(filePath), { name: `${key}.csv` });
  }

  archive.pipe(res);

  // Delete tmp folder from disk, when the request is finished
  res.on('close', () => {
    for (const [, { filePath }] of Object.entries(filePathMapping)) {
      rmSync(filePath);
    }
    rmdirSync(tmpFolder);
  });

  archive.finalize();
};
export default route;
