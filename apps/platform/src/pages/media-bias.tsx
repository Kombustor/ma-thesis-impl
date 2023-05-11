import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import MainLayout from '@/layouts/MainLayout';
import { getNotionPageHtml } from '@/lib/notion-page';

const NOTION_PAGE_URL =
  'https://catnip-shaker-688.notion.site/What-is-Media-Bias-711d9e128a054812a95856474e1eae51';

export async function getStaticProps() {
  return {
    props: {
      html: await getNotionPageHtml(NOTION_PAGE_URL),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 seconds
    revalidate: 300, // In seconds
  };
}

export default function MediaBiasInfoPage({
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MainLayout>
      <Head>
        <title>What is Media Bias? | NewsUnfold</title>
        <meta
          property="og:title"
          content="What is Media Bias? | NewsUnfold"
          key="title"
        />
      </Head>
      <div
        className="prose mx-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </MainLayout>
  );
}
