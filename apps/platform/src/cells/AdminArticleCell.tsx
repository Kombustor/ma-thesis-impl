import { Cell } from '@/cells/Cell';
import ArticleList from '@/components/article/admin/ArticleList';

export default function AdminArticleCell() {
  return (
    <Cell
      query={['admin-article.find-many']}
      Success={({ data }) => (
        <div className="mx-4">
          <ArticleList data={data} />
        </div>
      )}
    />
  );
}
