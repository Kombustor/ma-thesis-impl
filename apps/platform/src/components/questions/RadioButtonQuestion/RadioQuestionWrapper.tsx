import React from 'react';

import QuestionTitle from '@/components/questions/QuestionTitle';

type Props = {
  children: React.ReactNode;
  moreInfo?: React.ReactNode;
  question: string;
};

export default function RadioQuestionsWrapper({
  question,
  moreInfo,
  children,
}: Props) {
  return (
    <>
      <QuestionTitle question={question} />
      {moreInfo}
      <div className="flex justify-start">{children}</div>
    </>
  );
}
