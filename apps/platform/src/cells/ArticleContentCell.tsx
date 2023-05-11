import { Cell } from '@/cells/Cell';
import ShowContent, {
  Props as ShowContentProps,
} from '@/components/article/admin/ShowContent';

type Props = {
  articleId: string;
  setInferenceAvailable: (elem: boolean) => void;
  classifierView: boolean;
};

export default function ArticleContentCell({
  articleId,
  selectedContentIds,
  setSelectedContentIds,
  setInferenceAvailable,
  classifierView,
}: Props & Omit<ShowContentProps, 'contents' | 'inferenceAvailable'>) {
  return (
    <Cell
      query={['admin-article.find-with-content', articleId]}
      Success={({ data }) => {
        const { contents, inferenceAvailable } = data;
        setInferenceAvailable(inferenceAvailable);
        return (
          <ShowContent
            selectedContentIds={selectedContentIds}
            setSelectedContentIds={setSelectedContentIds}
            contents={contents}
            inferenceAvailable={inferenceAvailable}
            classifierView={classifierView}
          />
        );
      }}
    />
  );
}
