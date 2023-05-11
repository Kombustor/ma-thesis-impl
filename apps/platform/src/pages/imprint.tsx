import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import MainLayout from '@/layouts/MainLayout';
import { getNotionPageHtml } from '@/lib/notion-page';

const NOTION_PAGE_URL =
  'https://catnip-shaker-688.notion.site/Imprint-53e55908c07d45e28823690f00f46a77';

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

export default function ImprintPage({
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MainLayout>
      <Head>
        <title>Imprint | NewsUnfold</title>
        <meta property="og:title" content="Imprint | NewsUnfold" key="title" />
      </Head>
      <div
        className="prose mx-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </MainLayout>
  );
}
