import { Button, ButtonProps } from 'react-daisyui';

type Props = {
  outlined: boolean;
};

export function FeedbackButton({ outlined, ...props }: Props & ButtonProps) {
  return (
    <Button
      className="no-animation flex grow"
      variant={outlined ? 'outline' : undefined}
      {...props}
    >
      {props.children}
    </Button>
  );
}
