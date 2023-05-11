import type { CoverImage as CoverImageType } from '@prisma/client-platform';
import Image from 'next/image';

import wsrvImageLoader from '@/lib/image-loader';

type Props = {
  coverImage: CoverImageType;
};

export default function CoverImage({ coverImage }: Props) {
  return (
    <div className="relative h-64">
      <Image
        {...coverImage}
        loader={wsrvImageLoader}
        alt="Article cover image"
        placeholder="blur"
        className="rounded-lg"
        sizes="33vw"
        objectFit="cover"
        layout="fill"
        quality={100}
      />
    </div>
  );
}
