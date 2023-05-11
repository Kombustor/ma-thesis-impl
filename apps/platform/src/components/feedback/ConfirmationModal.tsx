import { Button, ButtonGroup, Modal } from 'react-daisyui';
import { HiX } from 'react-icons/hi';

type Props = {
  isLastArticle: boolean;
  isOpen: boolean;
  close: () => void;
  go: () => Promise<void>;
};

export default function ConfirmationModal({
  isOpen,
  isLastArticle,
  close,
  go,
}: Props) {
  return (
    <Modal open={isOpen}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={close}
      >
        <HiX />
      </Button>
      <Modal.Body>
        Are you sure you want to continue{' '}
        {isLastArticle ? 'to the end' : 'to the next article'}? You didn&apos;t
        give any feedback yet.
      </Modal.Body>
      <Modal.Actions>
        <ButtonGroup className="w-full">
          <Button className="w-1/2" variant="outline" onClick={close}>
            No, go back
          </Button>
          <Button
            className="w-1/2"
            variant="outline"
            onClick={async () => {
              close();
              await go();
            }}
          >
            Yes, continue
          </Button>
        </ButtonGroup>
      </Modal.Actions>
    </Modal>
  );
}
