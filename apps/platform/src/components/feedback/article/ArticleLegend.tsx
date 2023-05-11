import type { Article } from '@prisma/client-platform';
import React from 'react';
import {
  HiCalendar,
  HiLightningBolt,
  HiLink,
  HiNewspaper,
  HiUser,
} from 'react-icons/hi';

import { classNames } from '@mbg/ui';

import { HIGHLIGHTED_TEXT_CLASSNAMES } from '../utils';

type Props = Pick<Article, 'author' | 'date' | 'source' | 'sitename'>;

export function ArticleLegend({ author, date, source, sitename }: Props) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-start gap-2 text-center leading-tight">
      <a href={source} target="_blank" rel="noreferrer">
        <HiLink />
      </a>
      <Divider />
      <IconWithText>
        <HiUser /> {author}
      </IconWithText>
      <Divider />
      <IconWithText>
        <HiNewspaper /> {sitename}
      </IconWithText>
      <Divider />
      <IconWithText>
        <HiCalendar />
        {date.toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        })}
      </IconWithText>
      <Divider />
      <IconWithText>
        <HiLightningBolt />
        AI thinks
        <span
          className={classNames(
            HIGHLIGHTED_TEXT_CLASSNAMES,
            'bg-highlights-gray-base'
          )}
        >
          Not biased
        </span>
        <span
          className={classNames(
            HIGHLIGHTED_TEXT_CLASSNAMES,
            'bg-highlights-yellow-base'
          )}
        >
          Biased
        </span>
      </IconWithText>
    </div>
  );
}

function IconWithText({ children }: { children: React.ReactNode }) {
  return <span className="flex flex-row items-center gap-1">{children}</span>;
}

function Divider() {
  return <div className="h-6 min-w-[0.09rem] rounded-full bg-gray-400" />;
}
