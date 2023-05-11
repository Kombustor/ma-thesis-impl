import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import ArticleContentCell from '@/cells/ArticleContentCell';
import Actions from '@/components/article/admin/Actions';
import ArticleLayout from '@/layouts/ArticleLayout';

import { TError, trpc } from '@mbg/api-platform/lib/trpc';

export default function EditAndClassify() {
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [inferenceAvailable, setInferenceAvailable] = useState(false);
  const [classifierView, setClassifierView] = useState(true);
  const router = useRouter();
  const trpcContext = trpc.useContext();

  const articleId = router.query.articleid as string;

  const onChangeContent = () => {
    setSelectedContentIds([]);
    trpcContext.invalidateQueries([
      'admin-article.find-with-content',
      articleId,
    ]);
  };

  const analyzeContent = trpc.useMutation('content.analyze', {
    onSuccess: onChangeContent,
    onError(error) {
      toast.error((error as TError).message);
    },
  });

  const deleteContent = trpc.useMutation('content.delete-contents', {
    onSuccess: onChangeContent,
    onError(error) {
      toast.error((error as TError).message);
    },
  });
  const addGroundTruth = trpc.useMutation('content.add-ground-truth', {
    onSuccess: onChangeContent,
    onError(error) {
      toast.error((error as TError).message);
    },
  });

  const actions = useMemo(
    () => (
      <Actions
        amountSelectedSentences={selectedContentIds.length}
        handleDelete={() => {
          deleteContent.mutate(selectedContentIds);
        }}
        handleAnalyze={() => analyzeContent.mutate(articleId)}
        handleSetClassifierView={() => {
          setClassifierView(!classifierView);
          setSelectedContentIds([]);
        }}
        handleAddGroundTruth={(groundTruthBiased: boolean) => () => {
          addGroundTruth.mutate({ ids: selectedContentIds, groundTruthBiased });
        }}
        inferenceAvailable={inferenceAvailable}
        inferenceIsLoading={analyzeContent.isLoading}
        classifierView={classifierView}
      />
    ),
    [
      addGroundTruth,
      analyzeContent,
      articleId,
      classifierView,
      deleteContent,
      inferenceAvailable,
      selectedContentIds,
    ]
  );

  return (
    <ArticleLayout edit classify={inferenceAvailable}>
      {actions}
      <ArticleContentCell
        articleId={articleId}
        selectedContentIds={selectedContentIds}
        setSelectedContentIds={setSelectedContentIds}
        setInferenceAvailable={setInferenceAvailable}
        classifierView={classifierView}
      />
      {actions}
    </ArticleLayout>
  );
}
