import Link from 'next/link';

import CoverImage from '@/components/article/CoverImage';

import { ArticlePreview } from '@mbg/api-platform/schemas/article.schema';

type Props = {
  article: ArticlePreview;
  idx: number;
};

export default function ArticleCard({ article }: Props) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="group flex cursor-pointer flex-col justify-between rounded-lg bg-white text-black transition-all hover:scale-[1.005] hover:bg-slate-50">
        <CoverImage coverImage={article.coverImage} />
        <div className="flex grow flex-col justify-between px-4 py-2">
          <h1 className="group-hover:text-primary mb-4 text-ellipsis text-lg font-semibold transition-colors">
            {article.title}
          </h1>
          <div className="flex flex-row justify-between gap-2">
            <span>{article.sitename}</span>
            <span>{article.date.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
