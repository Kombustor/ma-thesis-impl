import { Button, ButtonProps } from 'react-daisyui';

export function FeedbackNextButton(props: ButtonProps) {
  return (
    <Button
      fullWidth
      color="primary"
      className="fixed bottom-4 right-4 mt-2 w-[31%] self-end"
      {...props}
    >
      Next
    </Button>
  );
}
