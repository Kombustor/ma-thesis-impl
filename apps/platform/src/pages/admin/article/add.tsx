import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';

import LinkForm from '@/components/article/admin/form/LinkForm';
import RawHtmlForm from '@/components/article/admin/form/RawHtmlForm';
import ArticleLayout from '@/layouts/ArticleLayout';
import warningToast from '@/lib/warning-toast';

import { trpc } from '@mbg/api-platform/lib/trpc';
import {
  ArticleLinkSchemaType,
  MODEL_NOT_READY,
} from '@mbg/api-platform/schemas/article.schema';

export default function IndexPage() {
  const [link, setLink] = useState<string | undefined>();
  const DISABLE_LINK_FORM_TIMEOUT = 10_000; // The time in milliseconds vm of the inference app needs for wake up
  const [disableLinkForm, setDisableLinkForm] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const router = useRouter();

  const rawToParsed = trpc.useMutation('admin-article.raw-to-parsed', {
    onSuccess(articleId) {
      router.push(`/admin/article/edit-and-classify/${articleId}`);
    },

    onError(error) {
      if (
        error.data?.code === 'INTERNAL_SERVER_ERROR' &&
        error.message === MODEL_NOT_READY
      ) {
        warningToast(error.message, DISABLE_LINK_FORM_TIMEOUT);
        setDisableLinkForm(true);
        setTimeout(() => {
          setDisableLinkForm(false);
        }, DISABLE_LINK_FORM_TIMEOUT);
      } else {
        toast.error(error.message);
      }
    },
  });

  async function onSubmit({ link, rawHtml }: ArticleLinkSchemaType) {
    let response;

    if (!corsError) {
      try {
        response = await fetch(link);
      } catch {
        setCorsError(true);
        setLink(link);
        toast.error(
          'Failed to get article content, please provide raw HTML yourself.'
        );
      }
      rawHtml = await response?.text();
    }

    if (rawHtml && link)
      rawToParsed.mutate({
        link,
        rawHtml,
      });
  }

  const formClassNames = 'mx-auto w-1/2';
  const formDisabled = disableLinkForm || rawToParsed.isLoading;

  return (
    <ArticleLayout>
      {/* If there is no cors error yet, show the form that fetches the article's html automatically */}
      {!corsError ? (
        <LinkForm
          onSubmit={onSubmit}
          classNames={formClassNames}
          disabled={formDisabled}
        />
      ) : (
        <>
          <Button className="btn-link">
            <a target="_blank" href={link} rel="noopener noreferrer">
              Open Article
            </a>
          </Button>
          {link && (
            <RawHtmlForm
              onSubmit={onSubmit}
              link={link}
              classNames={formClassNames}
              disabled={formDisabled}
            />
          )}
        </>
      )}
    </ArticleLayout>
  );
}
