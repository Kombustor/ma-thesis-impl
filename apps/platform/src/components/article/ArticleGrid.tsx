import ArticleCard from '@/components/article/ArticleCard';

import { ArticlePreview } from '@mbg/api-platform/schemas/article.schema';
import { LoadingIndicator } from '@mbg/ui';

type Props = {
  articles?: ArticlePreview[];
};

export default function ArticleGrid({ articles }: Props) {
  if (!articles) {
    return <LoadingIndicator fullHeight bgCircles="bg-neutral" />;
  }

  return (
    <div className="article-grid grid grid-cols-1 gap-4 md:grid-cols-3">
      {articles.map((article, idx) => (
        <ArticleCard key={article.id} article={article} idx={idx} />
      ))}
    </div>
  );
}
