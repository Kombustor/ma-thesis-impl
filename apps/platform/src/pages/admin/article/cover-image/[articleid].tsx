import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import CoverImage from '@/components/article/CoverImage';
import NewImageForm from '@/components/article/admin/cover-image/NewImageForm';
import AdminLayout from '@/layouts/AdminLayout';

import { TError, trpc } from '@mbg/api-platform/lib/trpc';
import { LoadingIndicator } from '@mbg/ui';

export default function EditAndClassify() {
  const router = useRouter();
  const trpcCtx = trpc.useContext();
  const articleId = router.query.articleid as string;

  const coverImageQuery = trpc.useQuery([
    'admin-article.get-cover-image',
    articleId,
  ]);
  const articleWithCoverImage = coverImageQuery.data;

  const updateCoverImageMutation = trpc.useMutation(
    'admin-article.update-cover-image',
    {
      onError(error) {
        toast.error((error as TError).message);
      },
    }
  );

  const updateCoverImage = async (imageUrl: string) => {
    await updateCoverImageMutation.mutateAsync({ id: articleId, imageUrl });

    trpcCtx.invalidateQueries(['admin-article.get-cover-image', articleId]);
  };

  // Loading indicator
  if (!articleWithCoverImage) {
    return (
      <AdminLayout>
        <LoadingIndicator />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold">Article</h1>
      <span>{articleWithCoverImage.title}</span>
      <h1 className="text-xl font-bold">Update image</h1>
      <NewImageForm
        loading={updateCoverImageMutation.isLoading}
        onSubmit={updateCoverImage}
      />
      <h1 className="text-xl font-bold">Preview</h1>
      <div className="relative h-64 w-96">
        <CoverImage coverImage={articleWithCoverImage.coverImage} />
      </div>
    </AdminLayout>
  );
}
