import { prisma } from './trpc/create-context';

export async function getUserById(id?: string) {
  if (!id) {
    return;
  }
  return await prisma.user.findFirst({
    where: {
      id,
    },
  });
}
