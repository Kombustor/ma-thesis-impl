import { useRouter } from 'next/router';
import React from 'react';
import { Navbar, NavbarProps } from 'react-daisyui';
import { HiNewspaper } from 'react-icons/hi';

import { classNames } from '@mbg/ui';

type Props = {
  hidePlatform?: boolean;
  navBarCenter?: React.ReactNode;
  navBarEnd?: React.ReactNode;
};

export default function Navigation({
  hidePlatform,
  navBarCenter,
  navBarEnd,
  ...props
}: Props & NavbarProps) {
  const router = useRouter();

  return (
    <Navbar {...props} className={classNames('w-full py-0', props.className)}>
      <Navbar.Start>
        {!hidePlatform && (
          <span
            className="m-2 flex cursor-pointer flex-row items-center gap-2 rounded-lg p-3 text-xl normal-case"
            onClick={() => router.push('/')}
          >
            <HiNewspaper />
            NewsUnfold
          </span>
        )}
      </Navbar.Start>
      <Navbar.Center className="hidden lg:flex">{navBarCenter}</Navbar.Center>
      <Navbar.End>{navBarEnd}</Navbar.End>
    </Navbar>
  );
}
