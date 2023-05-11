import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import FeedbackMechanismComparison from '@/components/feedback/mechanisms/FeedbackMechanismComparison';
import FeedbackMechanismControl from '@/components/feedback/mechanisms/FeedbackMechanismControl';
import FeedbackMechanismHighlights from '@/components/feedback/mechanisms/FeedbackMechanismHighlights';
import ErrorLayout from '@/layouts/ErrorLayout';
import LoadingLayout from '@/layouts/LoadingLayout';
import StudyLayout from '@/layouts/StudyLayout';
import { ensureAndTransitionCurrentProgress } from '@/lib/progress';
import withParticipantAuthenticated from '@/lib/with-participant-authenticated';

import { trpc } from '@mbg/api-platform/lib/trpc';
import {
  FeedbackMechanism,
  StudyProgress,
} from '@mbg/api-platform/models/enums';

export const getServerSideProps: GetServerSideProps =
  withParticipantAuthenticated(({ participant }) => async () => {
    const ssp = await ensureAndTransitionCurrentProgress({
      currentProgress: participant.studyProgress as StudyProgress,
      requiredProgress: StudyProgress.ARTICLES_08,
      allowTransitionFrom: StudyProgress.INTRO_TASK_07,
      participantId: participant.id,
    });
    if (ssp) {
      return ssp;
    }

    return {
      props: {
        feedbackMechanism: participant.feedbackMechanism,
        articleProgress: participant.articleProgress,
      },
    };
  });

export default function Articles({
  feedbackMechanism,
  articleProgress,
}: {
  feedbackMechanism: FeedbackMechanism;
  articleProgress: number;
}) {
  const router = useRouter();
  // Defaults to users article progress
  const [currentArticleIdx, setCurrentArticleIdx] = useState(articleProgress);
  const topRef = useRef<HTMLSpanElement>(null);

  const articleQuery = trpc.useQuery(['article.get-articles']);

  // Scroll into view initially
  useEffect(() => {
    if (articleQuery.data) {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [articleQuery, topRef]);

  const feedbackMechanismComponent = React.useMemo(() => {
    if (!articleQuery.data || !articleQuery.data[currentArticleIdx]) {
      return;
    }

    const gotoNextArticle = () => {
      // If there are more articles, go to the next one
      if (currentArticleIdx < articleQuery.data.length - 1) {
        setCurrentArticleIdx(currentArticleIdx + 1);
        setTimeout(() => {
          topRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        // Otherwise go to the next page
        router.push('/09-trust-check');
      }
    };

    const mechanismProps = {
      topRef,
      article: articleQuery.data[currentArticleIdx],
      gotoNextArticle,
      isLastArticle: currentArticleIdx >= articleQuery.data.length - 1,
    };
    switch (feedbackMechanism) {
      case FeedbackMechanism.HIGHLIGHTS:
        return <FeedbackMechanismHighlights {...mechanismProps} />;
      case FeedbackMechanism.COMPARISON:
        return <FeedbackMechanismComparison {...mechanismProps} />;
      case FeedbackMechanism.CONTROL:
        return <FeedbackMechanismControl {...mechanismProps} />;
      default:
        return;
    }
  }, [feedbackMechanism, articleQuery.data, currentArticleIdx, router]);

  if (articleQuery.isLoading) {
    return <LoadingLayout />;
  }

  if (
    articleQuery.isError ||
    !articleQuery.data ||
    !articleQuery.data[currentArticleIdx]
  ) {
    return (
      <ErrorLayout>
        Either no articles have been defined or an unknown error has been thrown
      </ErrorLayout>
    );
  }

  return (
    <StudyLayout
      progress={StudyProgress.ARTICLES_08}
      card={false}
      headerFixed={false}
    >
      <span className="display-none" ref={topRef} />
      {feedbackMechanismComponent}
    </StudyLayout>
  );
}
