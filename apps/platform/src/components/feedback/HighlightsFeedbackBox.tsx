import React, { useEffect, useRef, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';

import FeedbackBox from '@/components/feedback/box/FeedbackBox';
import { FeedbackButton } from '@/components/feedback/box/FeedbackButton';
import { FeedbackButtonGroup } from '@/components/feedback/box/FeedbackButtonGroup';
import ReasonInput from '@/components/feedback/box/ReasonInput';
import { SentenceBiasedText } from '@/components/feedback/box/SentenceBiasedText';
import useMediaQuery from '@/components/hooks/useMediaQuery';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';

type Props = {
  currentSentence: NonNullable<
    InferQueryOutput<'article.get-article'>
  >['contents'][number];
  submitFeedback: (
    contentId: string,
    biased: boolean,
    reason: string | null
  ) => void;
  children?: React.ReactNode;
};

export default function HighlightsFeedbackBox({
  currentSentence,
  submitFeedback,
  children,
  ...props
}: Props & React.ComponentProps<'div'>) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [reason, setReason] = useState(currentSentence.Feedback?.reason);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setReason(currentSentence.Feedback?.reason);
    isLargeScreen && inputRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSentence]);

  return (
    <FeedbackBox {...props}>
      <SentenceBiasedText biased={currentSentence.biased ?? false} />
      <ReasonInput
        ref={inputRef}
        value={reason || ''}
        onChange={(e) => setReason(e.target.value)}
      />
      <FeedbackButtonGroup>
        <FeedbackButton
          startIcon={<HiCheck size="22px" />}
          outlined={currentSentence.Feedback?.biased !== currentSentence.biased}
          onClick={() =>
            submitFeedback(currentSentence.id, !!currentSentence.biased, reason)
          }
        >
          Agree
        </FeedbackButton>
        <FeedbackButton
          startIcon={<HiX size="22px" />}
          outlined={
            currentSentence.Feedback === undefined ||
            currentSentence.Feedback?.biased === currentSentence.biased
          }
          onClick={() =>
            submitFeedback(currentSentence.id, !currentSentence.biased, reason)
          }
        >
          Disagree
        </FeedbackButton>
      </FeedbackButtonGroup>
      {children}
    </FeedbackBox>
  );
}
