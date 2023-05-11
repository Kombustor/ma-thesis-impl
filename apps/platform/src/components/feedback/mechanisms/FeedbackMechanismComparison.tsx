import type { Feedback } from '@prisma/client-platform';
import React, { useEffect, useRef, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';

import StudyArticle from '@/components/article/study/StudyArticle';
import ConfirmationModal from '@/components/feedback/ConfirmationModal';
import { FeedbackMechanismWrapper } from '@/components/feedback/FeedbackMechanismWrapper';
import { ComparisonIcon } from '@/components/feedback/article/ComparisonIcon';
import { FeedbackNextButton } from '@/components/feedback/article/FeedbackNextButton';
import { FeedbackProgress } from '@/components/feedback/article/FeedbackProgress';
import CenteredFloatingWrapper from '@/components/feedback/box/CenteredFloatingWrapper';
import FeedbackBox from '@/components/feedback/box/FeedbackBox';
import { FeedbackButton } from '@/components/feedback/box/FeedbackButton';
import { FeedbackButtonGroup } from '@/components/feedback/box/FeedbackButtonGroup';
import { SentenceBiasedText } from '@/components/feedback/box/SentenceBiasedText';
import {
  FeedbackMechanismProps,
  HIGHLIGHTED_TEXT_CLASSNAMES,
} from '@/components/feedback/utils';

import { trpc } from '@mbg/api-platform/lib/trpc';
import { FeedbackMechanism, HtmlType } from '@mbg/api-platform/models/enums';
import { classNames } from '@mbg/ui';

import { ArticleLegend } from '../article/ArticleLegend';

type ComparisonFeedback = Pick<
  Feedback,
  'biased' | 'basedOnClassifier' | 'createdAt'
>;

export const COMPARISON_HIGHLIGHT_CLASSES = classNames(
  'outline-dashed outline-1 outline-offset-[-1px]'
);

export default function FeedbackMechanismComparison({
  topRef,
  article,
  isLastArticle,
  gotoNextArticle,
}: FeedbackMechanismProps) {
  // ======= Sentence =======
  const firstSentenceRef = useRef<HTMLSpanElement>(null);
  const secondSentenceRef = useRef<HTMLSpanElement>(null);

  // All SPANs
  const feedbackableSentences = React.useMemo(
    () => article.contents.filter((c) => c.htmlType === HtmlType.SPAN),
    [article]
  );

  // Current sentence idx defaults to first sentence in feedbackableSentences
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<
    number | undefined
  >(0);

  // Confirmation modal
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // ======= Feedback =======
  // Tracking feedback sent to the backend at once in the end
  // Sentence id -> { biased, basedOnClassifier }
  const [feedback, setFeedback] = useState<Record<string, ComparisonFeedback>>(
    {}
  );
  const createFeedbackMutation = trpc.useMutation('feedback.create-many', {
    retry: 3,
  });

  // Store feedback in State
  const storeFeedback = (
    sentenceId: string,
    biased: boolean,
    basedOnClassifier: boolean
  ) => {
    setFeedback({
      ...feedback,
      [sentenceId]: {
        biased,
        basedOnClassifier,
        createdAt: new Date(),
      },
    });
  };

  // Move forward when the feedback updates
  useEffect(() => {
    if (!currentFirstSentence || Object.keys(feedback).length === 0) {
      return;
    }

    // Only continue automatically if we have feedback for both sentences
    if (
      !feedback[currentFirstSentence.id] ||
      (currentSecondSentence && !feedback[currentSecondSentence.id])
    ) {
      return;
    }

    // Select next non-annotated sentence
    // eslint-disable-next-line unicorn/no-useless-undefined
    let nextSentenceIdx = undefined;
    let searchIdx = currentSentenceIdx + 2;

    const checkSearchIdxIsValidNext = () => {
      const newFirstSentence = feedbackableSentences[searchIdx];
      const newSecondSentence = feedbackableSentences[searchIdx + 1];
      // Either we have a new first sentence and no feedback for it
      // Or we have no new second sentence
      // But if we have a second sentence it must not have feedback yet
      if (
        newFirstSentence &&
        feedback[newFirstSentence.id] === undefined &&
        (!newSecondSentence || feedback[newSecondSentence.id] === undefined)
      ) {
        nextSentenceIdx = searchIdx;
        return true;
      }
      return false;
    };
    while (searchIdx < article.contents.length) {
      if (checkSearchIdxIsValidNext()) {
        break;
      }
      searchIdx += 2;
    }

    if (nextSentenceIdx === undefined && currentSentenceIdx > 0) {
      // If we didn't find a next sentence, start searching from the beginning again
      searchIdx = 0;
      while (searchIdx < currentSentenceIdx) {
        if (checkSearchIdxIsValidNext()) {
          break;
        }
        searchIdx += 2;
      }
    }

    setCurrentSentenceIdx(nextSentenceIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  // Submit feedback to API
  const submitFeedback = async () => {
    await createFeedbackMutation.mutateAsync(
      Object.keys(feedback).map((sentenceId: keyof typeof feedback) => ({
        contentId: sentenceId,
        ...feedback[sentenceId],
      }))
    );

    gotoNextArticle();
  };

  // ======= Reset =======
  // When the article changes reset the current sentence index and the given feedback
  useEffect(() => {
    setCurrentSentenceIdx(0);
    setFeedback({});
  }, [article]);

  // ======= Variables =======
  const currentFirstSentence =
    currentSentenceIdx !== undefined &&
    feedbackableSentences[currentSentenceIdx];
  const currentSecondSentence =
    currentSentenceIdx !== undefined &&
    feedbackableSentences[currentSentenceIdx + 1];

  const totalFeedbackableSentences = feedbackableSentences.length;
  const feedbackedSentences = Object.keys(feedback).length;

  return (
    <FeedbackMechanismWrapper outerMargin={false}>
      <div className="basis-3/5">
        <StudyArticle
          disableMargin
          metaData={<ArticleLegend mechanism={FeedbackMechanism.COMPARISON} />}
          author={article.author}
          date={article.date}
          sentences={article.contents.map((c) => {
            const indexInFeedbackableSentences =
              feedbackableSentences.findIndex((s) => s.id === c.id);
            const basedOnClassifier = indexInFeedbackableSentences % 2 === 0;
            const isCurrentSentence =
              currentSentenceIdx !== undefined
                ? (basedOnClassifier
                  ? indexInFeedbackableSentences === currentSentenceIdx
                  : indexInFeedbackableSentences === currentSentenceIdx + 1)
                : false;

            return {
              ...c,
              highlighted: false,
              highlightColor:
                (basedOnClassifier && c.biased) ||
                (!basedOnClassifier && feedback[c.id]?.biased)
                  ? classNames('bg-highlights-yellow-base')
                  : classNames('bg-highlights-gray-base'),
              active: isCurrentSentence,
              activeColor: classNames({
                'bg-highlights-yellow-active': basedOnClassifier && c.biased,
                'bg-highlights-gray-active': basedOnClassifier && !c.biased,
                [COMPARISON_HIGHLIGHT_CLASSES]: !basedOnClassifier,
              }),
              ref: isCurrentSentence
                ? (basedOnClassifier
                  ? firstSentenceRef
                  : secondSentenceRef)
                : undefined,
              feedbackIcon: <ComparisonIcon biased={feedback[c.id]?.biased} />,
              onClick: () => {
                setCurrentSentenceIdx(
                  basedOnClassifier
                    ? indexInFeedbackableSentences
                    : indexInFeedbackableSentences - 1
                );
              },
            };
          })}
        />
      </div>
      <div className={classNames('flex basis-[25%] flex-col justify-between')}>
        <div className="flex flex-col gap-3">
          <CenteredFloatingWrapper
            topRef={topRef}
            centerTargetRef={firstSentenceRef}
            dependencies={[currentSentenceIdx]}
            relativeToEnd
            className="flex flex-col gap-2"
          >
            {currentFirstSentence && currentFirstSentence.biased !== null ? (
              <FeedbackBox>
                <SentenceBiasedText biased={currentFirstSentence.biased} />
                <FeedbackButtonGroup>
                  <FeedbackButton
                    startIcon={<HiCheck size="22px" />}
                    outlined={
                      feedback[currentFirstSentence.id] === undefined ||
                      feedback[currentFirstSentence.id]?.biased !==
                        currentFirstSentence.biased
                    }
                    onClick={() =>
                      storeFeedback(
                        currentFirstSentence.id,
                        !!currentFirstSentence.biased,
                        true
                      )
                    }
                  >
                    Agree
                  </FeedbackButton>
                  <FeedbackButton
                    startIcon={<HiX size="22px" />}
                    outlined={
                      feedback[currentFirstSentence.id] === undefined ||
                      feedback[currentFirstSentence.id]?.biased ===
                        currentFirstSentence.biased
                    }
                    onClick={() =>
                      storeFeedback(
                        currentFirstSentence.id,
                        !currentFirstSentence.biased,
                        true
                      )
                    }
                  >
                    Disagree
                  </FeedbackButton>
                </FeedbackButtonGroup>
              </FeedbackBox>
            ) : undefined}
            {currentSecondSentence ? (
              <FeedbackBox>
                <span>
                  What about{'  '}
                  <span
                    className={classNames(
                      COMPARISON_HIGHLIGHT_CLASSES,
                      HIGHLIGHTED_TEXT_CLASSNAMES
                    )}
                  >
                    this one
                  </span>{' '}
                  ?
                </span>
                <FeedbackButtonGroup>
                  <FeedbackButton
                    startIcon={
                      <ComparisonIcon
                        biased
                        positionClasses=""
                        sizeClasses="w-[22px] h-[22px]"
                      />
                    }
                    outlined={
                      feedback[currentSecondSentence.id] === undefined ||
                      feedback[currentSecondSentence.id]?.biased === false
                    }
                    onClick={() =>
                      storeFeedback(currentSecondSentence.id, true, false)
                    }
                  >
                    Biased
                  </FeedbackButton>
                  <FeedbackButton
                    startIcon={
                      <ComparisonIcon
                        biased={false}
                        positionClasses=""
                        sizeClasses="w-[22px] h-[22px]"
                      />
                    }
                    outlined={
                      feedback[currentSecondSentence.id] === undefined ||
                      feedback[currentSecondSentence.id]?.biased !== false
                    }
                    onClick={() =>
                      storeFeedback(currentSecondSentence.id, false, false)
                    }
                  >
                    Not biased
                  </FeedbackButton>
                </FeedbackButtonGroup>
              </FeedbackBox>
            ) : undefined}
          </CenteredFloatingWrapper>
          <FeedbackProgress
            done={feedbackedSentences}
            total={totalFeedbackableSentences}
          />
        </div>
        <div>
          <ConfirmationModal
            isOpen={confirmationModalOpen}
            isLastArticle={isLastArticle}
            close={() => setConfirmationModalOpen(false)}
            go={submitFeedback}
          />
          <FeedbackNextButton
            onClick={() => {
              if (feedbackedSentences <= 0) {
                return setConfirmationModalOpen(true);
              }
              submitFeedback();
            }}
            loading={createFeedbackMutation.isLoading}
            disabled={createFeedbackMutation.isLoading}
          />
        </div>
      </div>
    </FeedbackMechanismWrapper>
  );
}
