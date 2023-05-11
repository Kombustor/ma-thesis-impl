import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import StudyNextButton from '@/components/layout/StudyNextButton';
import MediaBiasExample from '@/components/misc/MediaBiasExample';
import TextContainer from '@/components/misc/TextContainer';
import StudyLayout from '@/layouts/StudyLayout';
import { requireProgress } from '@/lib/progress';

import { StudyProgress } from '@mbg/api-platform/models/enums';
import { classNames } from '@mbg/ui';

export const getServerSideProps: GetServerSideProps = requireProgress(
  StudyProgress.INTRO_BIAS_05,
  StudyProgress.INTRO_STUDY_04
)();

export default function IntroductionMediaBiasPage() {
  const router = useRouter();
  const [nextClickedCount, setNextClickedCount] = useState(0);
  const commonSpanHighlightClassNames = classNames('rounded-md px-1');
  const commonSpanWordHighlightClassNames = classNames('italic font-bold');
  const mediaBiasExamples = [
    {
      heading: 'Subjective intensifiers',
      biasedSentence: (
        <>
          Schnabel himself did the{' '}
          <span className={commonSpanWordHighlightClassNames}>fantastic</span>{' '}
          reproductions of Basquiat&apos;s work.
        </>
      ),
      notBiasedSentence: (
        <>
          Schnabel himself did the{' '}
          <span className={commonSpanWordHighlightClassNames}>accurate</span>{' '}
          reproductions of Basquiat&apos;s work.
        </>
      ),
    },
    {
      heading: 'Strong labels',
      biasedSentence: (
        <>
          &ldquo;The people want the Truth!&rdquo; : Trump{' '}
          <span className={commonSpanWordHighlightClassNames}>gloats</span> over
          the loss of American media jobs.
        </>
      ),
      notBiasedSentence: (
        <>
          &ldquo;The people want the Truth!&rdquo; : Trump{' '}
          <span className={commonSpanWordHighlightClassNames}>tweets</span> over
          the loss of American media jobs.
        </>
      ),
    },
    {
      heading: 'One sided terms',
      biasedSentence: (
        <>
          Concerned Women for America&apos;s major areas of political activity
          have consisted of opposition to gay causes,{' '}
          <span className={commonSpanWordHighlightClassNames}>pro-life</span>{' '}
          law...
        </>
      ),
      notBiasedSentence: (
        <>
          Concerned Women for America&apos;s major areas of political activity
          have consisted of opposition to gay causes,{' '}
          <span className={commonSpanWordHighlightClassNames}>
            anti-abortion
          </span>{' '}
          law...
        </>
      ),
    },
  ];
  return (
    <StudyLayout
      progress={StudyProgress.INTRO_BIAS_05}
      nextButton={
        <StudyNextButton
          onClick={() =>
            nextClickedCount >= 1
              ? router.push('/06-attention-check')
              : setNextClickedCount(nextClickedCount + 1)
          }
        />
      }
    >
      <TextContainer
        className={classNames({ 'gap-10': nextClickedCount >= 1 })}
      >
        {nextClickedCount < 1 ? (
          <>
            <p>
              Important info before you can start: we will now provide you with
              a few examples that should help you to understand possible media
              bias instances better. For each example, a biased sentence has{' '}
              <span
                className={classNames(
                  commonSpanHighlightClassNames,
                  'bg-highlights-yellow-base'
                )}
              >
                yellow background color
              </span>{' '}
              shown first and is followed by it&apos;s neutral form in{' '}
              <span
                className={classNames(
                  commonSpanHighlightClassNames,
                  'bg-highlights-gray-base'
                )}
              >
                gray background color
              </span>
              .
            </p>
            <p>
              Please note that bias is different from negative sentiment. Bias
              is ambiguous and subtle, it can be positive, negative or not even
              have a particular sentiment but it still can imply or intensify
              the opinion/emotion.
            </p>
          </>
        ) : (
          <>
            {mediaBiasExamples.map((example, idx) => (
              <MediaBiasExample key={idx} {...example} />
            ))}
          </>
        )}
      </TextContainer>
    </StudyLayout>
  );
}
