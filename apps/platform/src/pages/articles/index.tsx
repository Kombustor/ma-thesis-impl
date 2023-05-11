import Head from 'next/head';

import ArticleGrid from '@/components/article/ArticleGrid';
import { useTutorial } from '@/components/hooks/useTutorial';
import Tutorial from '@/components/tutorial/Tutorial';
import TutorialBanner from '@/components/tutorial/TutorialBanner';
import MainLayout from '@/layouts/MainLayout';
import { TUTORIAL_STEPS_INDEX } from '@/lib/tutorial-steps';
import { requireParticipantAuth } from '@/lib/with-participant-authenticated';

import { trpc } from '@mbg/api-platform/lib/trpc';

// eslint-disable-next-line unicorn/prefer-export-from
export const getServerSideProps = requireParticipantAuth;

export default function ArticlesPage() {
  const articleQuery = trpc.useQuery(['article.get-articles']);
  const { showTutorial, tutorialRunning, ...tutorial } = useTutorial();

  return (
    <MainLayout>
      <Head>
        <title>Articles | NewsUnfold</title>
        <meta property="og:title" content="Articles | NewsUnfold" key="title" />
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
      {showTutorial && <TutorialBanner {...tutorial} />}
      {articleQuery.isFetched && tutorialRunning && (
        <Tutorial steps={TUTORIAL_STEPS_INDEX} run continuous hideCloseButton />
      )}
      <ArticleGrid articles={articleQuery.data} />
    </MainLayout>
  );
}
