import Link from 'next/link';
import React from 'react';

import { useTutorial } from '@/components/hooks/useTutorial';

import { classNames } from '@mbg/ui';

export default function Footer(props: React.ComponentProps<'footer'>) {
  const tutorial = useTutorial();
  return (
    <footer
      {...props}
      className={classNames(
        'flex h-10 flex-row items-center justify-center gap-4 text-sm',
        props.className
      )}
    >
      <Link href="/imprint">Imprint</Link>
      <Link href="/privacy-policy">Privacy Policy</Link>
      {!tutorial.showTutorial && (
        <span
          className="umami--click--restart-tutorial cursor-pointer"
          onClick={tutorial.restart}
        >
          Restart tutorial
        </span>
      )}
    </footer>
  );
}
