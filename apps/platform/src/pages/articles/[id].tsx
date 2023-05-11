/* eslint-disable unicorn/no-useless-undefined */

/* eslint-disable unicorn/no-null */
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Progress } from 'react-daisyui';
import { HiX } from 'react-icons/hi';

import Article from '@/components/article/Article';
import ArticleGrid from '@/components/article/ArticleGrid';
import QuestionnaireLink from '@/components/article/QuestionnaireLink';
import HighlightsFeedbackBox from '@/components/feedback/HighlightsFeedbackBox';
import { ArticleLegend } from '@/components/feedback/article/ArticleLegend';
import { FeedbackIcon } from '@/components/feedback/article/FeedbackIcon';
import MarkedIcon from '@/components/feedback/article/MarkedIcon';
import CenteredFloatingWrapper from '@/components/feedback/box/CenteredFloatingWrapper';
import useMediaQuery from '@/components/hooks/useMediaQuery';
import { useTutorial } from '@/components/hooks/useTutorial';
import BiasLabel from '@/components/misc/BiasLabel';
import Tutorial from '@/components/tutorial/Tutorial';
import LoadingLayout from '@/layouts/LoadingLayout';
import MainLayout from '@/layouts/MainLayout';
import { TUTORIAL_STEPS_ARTICLE } from '@/lib/tutorial-steps';
import { requireParticipantAuth } from '@/lib/with-participant-authenticated';

import { trpc } from '@mbg/api-platform/lib/trpc';
import { HtmlType } from '@mbg/api-platform/models/enums';
import { MARKED_EXPLANATIONS } from '@mbg/api-platform/schemas/article.schema';
import { SETUP_CONFIG } from '@mbg/api-platform/setupconfig';
import { classNames } from '@mbg/ui';

// eslint-disable-next-line unicorn/prefer-export-from
export const getServerSideProps = requireParticipantAuth;

export default function ArticlePage() {
  const router = useRouter();
  const trpcCtx = trpc.useContext();
  const tutorial = useTutorial();
  const articleId = router.query.id as string;
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  // Fetch article content
  const articleQuery = trpc.useQuery(['article.get-article', articleId]);
  // Fetch recommended articles
  const recommendedArticlesQuery = trpc.useQuery([
    'article.get-recommended-articles',
    articleId,
  ]);
  const article = articleQuery.data;
  const articleLoaded = !!articleQuery.data;

  // Ref to top of page
  const topRef = useRef<HTMLSpanElement>(null);
  // Ref to current sentence span
  const currentSentenceRef = useRef<HTMLSpanElement>(null);

  // ======= Sentence =======
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<
    number | undefined
  >();

  // ======= Feedback =======
  const createFeedbackMutation = trpc.useMutation('feedback.create', {
    retry: 3,
  });
  const [feedbackedSentences, setFeedbackedSentences] = useState<number>(0);

  // Submit feedback to API
  const submitFeedback = async (
    contentId: string,
    biased: boolean,
    reason: string | null
  ) => {
    // Can usually not happen, just for type safety
    if (!currentSentenceIdx || !article) {
      return;
    }

    // Select next sentence
    // eslint-disable-next-line unicorn/no-useless-undefined
    let nextSentenceIdx = undefined;
    let searchIdx = currentSentenceIdx + 1;
    const checkSearchIdxIsValidNext = (checkFeedback: boolean) => {
      const sentence = article.contents[searchIdx];
      if (
        sentence &&
        sentence.htmlType === HtmlType.SPAN &&
        (!checkFeedback || sentence.Feedback === undefined)
      ) {
        nextSentenceIdx = searchIdx;
        return true;
      }
      return false;
    };
    while (searchIdx < article.contents.length) {
      if (checkSearchIdxIsValidNext(false)) {
        break;
      }
      searchIdx++;
    }

    if (nextSentenceIdx === undefined && currentSentenceIdx > 0) {
      // If we didn't find a next sentence, start searching from the beginning again
      searchIdx = 0;
      while (searchIdx < currentSentenceIdx) {
        if (checkSearchIdxIsValidNext(true)) {
          break;
        }
        searchIdx++;
      }
    }

    // Proceed to next sentence
    setCurrentSentenceIdx(nextSentenceIdx);

    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    trpcCtx.cancelQuery(['article.get-article', articleId]);

    // Optimistically update
    article.contents[currentSentenceIdx].Feedback = { biased, reason };
    setFeedbackedSentences(article.contents.filter((c) => c.Feedback).length);

    // Send feedback to backend
    await createFeedbackMutation.mutateAsync({
      contentId,
      biased,
      reason: reason || null,
    });
  };

  const selectFirstSentence = useCallback(() => {
    if (!article) return;

    setCurrentSentenceIdx(
      article.contents.findIndex((c) => c.htmlType === HtmlType.SPAN)
    );
  }, [article]);

  useEffect(() => {
    if (!article) {
      return;
    }
    tutorial.tutorialRunning && selectFirstSentence();
  }, [tutorial.tutorialRunning, article, selectFirstSentence]);

  // Effect when the article was loaded
  useEffect(() => {
    if (!articleLoaded || !article) {
      return;
    }

    // Set to the first feedbackable sentence
    isLargeScreen && selectFirstSentence();

    setFeedbackedSentences(article.contents.filter((c) => c.Feedback).length);

    // Scroll to top
    if (isLargeScreen) {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleLoaded, articleId]);

  const totalFeedbackableSentences = React.useMemo(() => {
    if (!article) {
      return 0;
    }
    return article.contents.filter((c) => c.htmlType === HtmlType.SPAN).length;
  }, [article]);

  // Loading indicator
  if (!article) {
    return (
      <LoadingLayout>
        <Head>
          <meta
            name="description"
            content="NewsUnfold helps you to read news critically and actively question what you are reading. By making media bias and slanted content visible through our AI, you can easily estimate the trustworthiness of the news."
            key="description"
          />
          <meta
            property="og:description"
            content="NewsUnfold helps you to read news critically and actively question what you are reading. By making media bias and slanted content visible through our AI, you can easily estimate the trustworthiness of the news."
            key="ogdescription"
          />
          <meta property="og:image" content="/teaser.png" key="image" />
        </Head>
      </LoadingLayout>
    );
  }

  return (
    <MainLayout className="py-4" container={false}>
      {tutorial.tutorialRunning && (
        <Tutorial
          onFinish={() => {
            tutorial.finish();
            topRef?.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          steps={TUTORIAL_STEPS_ARTICLE}
          run
          continuous
        />
      )}
      <div className="mx-4 flex max-w-screen-2xl flex-col gap-4  lg:mx-4 2xl:container 2xl:mx-auto">
        <div className="m-auto flex flex-col gap-4 lg:flex-row">
          <div className={classNames('lg:basis-[20%]')}>
            <BiasLabel
              className="article-summary sticky top-8"
              {...article.qualityStandards}
            />
          </div>
          <div className="lg:basis-[60%]">
            <span className="display-none" ref={topRef} />
            <Article
              className="main-article"
              disableMargin
              metaData={<ArticleLegend {...article} />}
              sentences={article.contents.map((c, idx) => ({
                ...c,
                ref:
                  idx === currentSentenceIdx ? currentSentenceRef : undefined,
                highlighted: true,
                highlightColor: c.biased
                  ? classNames('bg-highlights-yellow-base')
                  : classNames('bg-highlights-gray-base'),
                active: idx === currentSentenceIdx,
                activeColor: classNames({
                  'bg-highlights-yellow-active': c.biased,
                  'bg-highlights-gray-active': !c.biased,
                }),
                feedbackIcon: c.Feedback ? (
                  <FeedbackIcon
                    userBiased={c.Feedback.biased}
                    classifierBiased={c.biased || false}
                  />
                ) : (c.marked ? (
                  <MarkedIcon explanation={MARKED_EXPLANATIONS[c.marked]} />
                ) : undefined),
                onClick: () => {
                  setCurrentSentenceIdx(idx);
                },
              }))}
              {...article}
            />
          </div>
          <div
            className={classNames(
              'lg:flex lg:basis-[20%] lg:flex-col',
              'lg:relative fixed bottom-4 left-4 md:left-auto right-4 lg:bottom-0 lg:right-0 translate-x-0.5 lg:translate-x-0 lg:mr-0 z-50',
              'shadow-[0px_-3px_16px_0px_#B1B1B1] lg:shadow-none'
            )}
          >
            <div className="flex flex-col gap-3">
              {currentSentenceIdx !== undefined ? (
                <CenteredFloatingWrapper
                  topRef={topRef}
                  centerTargetRef={currentSentenceRef}
                  dependencies={[currentSentenceIdx]}
                >
                  <HighlightsFeedbackBox
                    className="feedback-box"
                    currentSentence={article.contents[currentSentenceIdx]}
                    submitFeedback={submitFeedback}
                  >
                    <Button
                      className="absolute right-2 top-2 lg:hidden"
                      color="ghost"
                      onClick={() => setCurrentSentenceIdx(undefined)}
                    >
                      <HiX className="h-4 w-4" />
                    </Button>
                    <div className="mt-2 flex flex-row items-center gap-1">
                      <Progress
                        value={feedbackedSentences / totalFeedbackableSentences}
                      />
                      <span className="font-bold">
                        {feedbackedSentences}/{totalFeedbackableSentences}
                      </span>
                    </div>
                  </HighlightsFeedbackBox>
                </CenteredFloatingWrapper>
              ) : undefined}
            </div>
          </div>
        </div>
        <QuestionnaireLink url={SETUP_CONFIG.questionnaireLink} />
        <div className="recommended-articles">
          <h1 className="mb-2 text-xl font-bold">Continue Reading</h1>
          <ArticleGrid articles={recommendedArticlesQuery.data} />
        </div>
      </div>
    </MainLayout>
  );
}
