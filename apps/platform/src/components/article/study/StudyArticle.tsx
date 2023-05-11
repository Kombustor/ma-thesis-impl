import { Article, Content } from '@prisma/client-platform';
import React from 'react';

import Card from '@/components/layout/Card';

import { HtmlType } from '@mbg/api-platform/models/enums';
import { classNames } from '@mbg/ui';

type HighlightState = {
  highlightColor: string;
  highlighted: boolean;
  activeColor: string;
  active: boolean;
  ref?: React.RefObject<HTMLSpanElement>;
  feedbackIcon?: React.ReactNode;
  onClick?: React.ComponentProps<'span'>['onClick'];
};

type HighlightableSentence = Content & HighlightState;

type Props = Pick<Article, 'author' | 'date'> & {
  sentences: HighlightableSentence[];
  metaData?: React.ReactNode;
};

const ARTICLE_CLASSES = classNames('prose max-w-full font-[Lato]');
const METADATA_CLASSES = classNames('mb-3 block text-gray-400');
const H1_CLASSES = classNames('mb-4');
const H2_CLASSES = classNames('mt-5');
const H3_CLASSES = classNames('mt-4');
const SPAN_CLASSES = ({
  highlighted,
  active,
  highlightColor,
  activeColor,
  onClick,
}: HighlightState) =>
  classNames('mr-1', {
    'px-1 rounded-md': highlighted || active,
    [highlightColor]: highlighted && !active,
    [activeColor]: active,
    'cursor-pointer': !!onClick,
  });
const PARAGRAPH_CLASSES = classNames('');

export default function StudyArticle({
  author,
  date,
  sentences,
  metaData,
  ...props
}: Props & Omit<React.ComponentProps<typeof Card>, 'children'>) {
  // Generate article content
  const articleContent = React.useMemo(() => {
    let currParagraph = 0,
      foundHeading = false;

    const elements: React.ReactElement[] = [];
    let spans: React.ReactElement[] = [];

    const pushParagraph = (id: string) => {
      elements.push(
        <p className={PARAGRAPH_CLASSES} key={id}>
          {spans}
        </p>
      );
      spans = [];
    };

    for (const s of sentences) {
      const { id, paragraphIndex, htmlType, text, ...props } = s;

      const isHeading = [HtmlType.H1, HtmlType.H2, HtmlType.H3].includes(
        htmlType as HtmlType
      );

      // Push the paragraph when changing paragraphs
      if (currParagraph !== paragraphIndex && spans.length > 0) {
        pushParagraph(`paragraph-${currParagraph}`);
      }

      if (!isHeading && paragraphIndex) {
        currParagraph = paragraphIndex;
      }

      switch (htmlType) {
        case HtmlType.H1:
          elements.push(
            <h1 className={H1_CLASSES} key={id}>
              {text}
            </h1>
          );
          break;
        case HtmlType.H2:
          elements.push(
            <h2 className={H2_CLASSES} key={id}>
              {text}
            </h2>
          );
          break;
        case HtmlType.H3:
          elements.push(
            <h3 className={H3_CLASSES} key={id}>
              {text}
            </h3>
          );
          break;
        case HtmlType.SPAN:
          spans.push(
            <span
              className={classNames(
                SPAN_CLASSES(props),
                'transition-colors relative'
              )}
              onClick={props.onClick}
              ref={props.ref}
              key={id}
            >
              {text}
              {props.feedbackIcon}
            </span>
          );
          break;
      }

      // Put the metadata info below the first heading
      if (isHeading && !foundHeading) {
        foundHeading = true;
        elements.push(
          <span className={METADATA_CLASSES} key="metadata">
            Written by {author} |{' '}
            {date.toLocaleDateString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
            })}
            {metaData}
          </span>
        );
      }
    }

    pushParagraph('paragraph-last');

    return <article className={ARTICLE_CLASSES}>{elements}</article>;
  }, [author, date, sentences, metaData]);

  return <Card {...props}>{articleContent}</Card>;
}
