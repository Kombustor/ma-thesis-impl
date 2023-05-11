import ArticlesCell from '@/cells/AdminArticleCell';
import AdminLayout from '@/layouts/AdminLayout';

export default function ArticleIndex() {
  return (
    <AdminLayout container={false}>
      <ArticlesCell />
    </AdminLayout>
  );
}
