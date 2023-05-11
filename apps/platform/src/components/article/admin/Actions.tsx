import { useRouter } from 'next/router';
import { Button, ButtonGroup } from 'react-daisyui';

type Props = {
  amountSelectedSentences: number;
  inferenceAvailable?: boolean;
  inferenceIsLoading?: boolean;
  handleDelete: () => void;
  handleAnalyze?: () => void;
  handleSetClassifierView: () => void;
  handleAddGroundTruth: (biased: boolean) => () => void;
  classifierView: boolean;
};

export default function Actions({
  amountSelectedSentences,
  inferenceAvailable,
  inferenceIsLoading,
  handleDelete,
  handleAnalyze,
  handleSetClassifierView,
  handleAddGroundTruth,
  classifierView,
}: Props) {
  const router = useRouter();
  return (
    <div className="flex justify-between py-10">
      {classifierView ? (
        <Button
          color="error"
          disabled={amountSelectedSentences == 0}
          onClick={handleDelete}
        >
          Remove ({amountSelectedSentences}) sentences
        </Button>
      ) : (
        <ButtonGroup>
          <Button onClick={handleAddGroundTruth(true)}>Biased</Button>
          <Button onClick={handleAddGroundTruth(false)}>Not Biased</Button>
        </ButtonGroup>
      )}
      <Button
        disabled={!inferenceAvailable}
        onClick={() => {
          router.push('/admin/article/add');
        }}
      >
        Add another one
      </Button>
      {classifierView && (
        <Button
          color="success"
          disabled={inferenceIsLoading || inferenceAvailable}
          loading={inferenceIsLoading}
          onClick={handleAnalyze}
        >
          Classify content
        </Button>
      )}
      <ButtonGroup>
        <Button active={!classifierView} onClick={handleSetClassifierView}>
          Ground Truth
        </Button>
        <Button active={classifierView} onClick={handleSetClassifierView}>
          Classifier
        </Button>
      </ButtonGroup>
    </div>
  );
}
