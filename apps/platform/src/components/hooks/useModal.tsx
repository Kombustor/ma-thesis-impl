import React from 'react';
import { Button, Modal } from 'react-daisyui';
import { HiX } from 'react-icons/hi';

export type UseModalProps = {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export type ModalProps = {
  trigger: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

type UseModal = {
  close: () => void;
  open: () => void;
  Modal: React.FC<ModalProps>;
};

export default function useModal({
  defaultOpen,
  onOpen,
  onClose,
}: UseModalProps): UseModal {
  const [isOpen, setOpen] = React.useState(defaultOpen || false);

  const close = () => {
    setOpen(false);
    onClose?.();
  };
  const open = () => {
    setOpen(true);
    onOpen?.();
  };

  return {
    close,
    open,
    Modal: ({ trigger, header, actions, children }: ModalProps) => (
      <>
        {trigger}
        {isOpen && (
          <Modal open={isOpen}>
            <Button
              size="sm"
              shape="circle"
              className="absolute right-2 top-2"
              onClick={close}
            >
              <HiX />
            </Button>
            {header && <Modal.Header>{header}</Modal.Header>}
            <Modal.Body>{children}</Modal.Body>
            <Modal.Actions>{actions}</Modal.Actions>
          </Modal>
        )}
      </>
    ),
  };
}
