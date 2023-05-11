import cryptoRandomString from 'crypto-random-string';
import { existsSync, mkdirSync } from 'node:fs';

export function createTmpFolder() {
  const tmpFolderName = `/tmp/${cryptoRandomString({
    length: 12,
    type: 'alphanumeric',
  })}`;
  if (!existsSync(tmpFolderName)) {
    mkdirSync(tmpFolderName);
  }
  return tmpFolderName;
}
