import { classNames } from '@mbg/ui';

type Props = {
  question: string;
  className?: string;
};

export default function QuestionTitle({ question, className }: Props) {
  return (
    <h3 className={classNames(className, 'text-2xl font-medium leading-tight')}>
      {question}
    </h3>
  );
}
