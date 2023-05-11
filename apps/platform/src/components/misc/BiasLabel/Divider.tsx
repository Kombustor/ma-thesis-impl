import { classNames } from '@mbg/ui';

type Props = {
  small?: boolean;
};

export default function Divider({ small }: Props) {
  return (
    <div
      className={classNames('w-full bg-black', {
        'h-1': !small,
        'h-0.5': small,
      })}
    />
  );
}
