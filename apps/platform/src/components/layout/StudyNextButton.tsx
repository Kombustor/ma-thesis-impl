import { Button, ButtonProps } from 'react-daisyui';

type Props = {
  text?: string;
};

export default function StudyNextButton({
  text = 'Next',
  ...props
}: Props & ButtonProps) {
  return (
    <Button className="btn-primary btn-outline mb-16 mt-6 w-4/12" {...props}>
      {text}
    </Button>
  );
}
