import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import MainLayout from '@/layouts/MainLayout';
import { getNotionPageHtml } from '@/lib/notion-page';

const NOTION_PAGE_URL =
  'https://catnip-shaker-688.notion.site/Privacy-Policy-c155020896994beeaeaa8667a240c36d';

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

export default function PrivacyPolicyPage({
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MainLayout>
      <Head>
        <title>Privacy Policy | NewsUnfold</title>
        <meta
          property="og:title"
          content="Privacy Policy | NewsUnfold"
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
