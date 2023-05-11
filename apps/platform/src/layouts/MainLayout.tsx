import '@fontsource/lato';

import React from 'react';
import { HiDocumentText, HiHome, HiQuestionMarkCircle } from 'react-icons/hi';

import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/NavBar';
import NavMenu from '@/components/layout/NavMenu';
import Navigation from '@/components/layout/Navigation';

import { classNames } from '@mbg/ui';

export type MainLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  lightMode?: boolean;
  headerClassNames?: string;
  footerClassNames?: string;
  navigation?: React.ReactNode;
};

export const MAIN_NAV_ITEMS = [
  {
    name: 'Introduction',
    link: '/',
    icon: <HiHome />,
  },
  {
    name: 'Articles',
    link: '/articles',
    icon: <HiDocumentText />,
  },
  {
    name: 'What is Media Bias?',
    link: '/media-bias',
    icon: <HiQuestionMarkCircle />,
    additionalClasses: 'media-bias-navitem',
  },
];

export default function MainLayout({
  children,
  container = true,
  lightMode = true,
  headerClassNames,
  footerClassNames,
  navigation,
  ...props
}: MainLayoutProps & React.ComponentProps<'div'>) {
  return (
    <div
      data-theme={lightMode ? 'brandlight' : undefined}
      className={classNames(
        'flex flex-col min-h-screen min-w-screen max-w-screen font-[Lato] overflow-x-hidden',
        {
          'bg-slate-100': lightMode,
        }
      )}
    >
      <header className={classNames('w-full', headerClassNames)}>
        {navigation || (
          <Navigation
            className="bg-base-100"
            navBarCenter={<NavBar items={MAIN_NAV_ITEMS} />}
            navBarEnd={<NavMenu items={MAIN_NAV_ITEMS} />}
          />
        )}
      </header>
      <main
        {...props}
        className={classNames(
          'flex flex-col grow',
          {
            'container py-4 mx-auto': container,
          },
          props.className
        )}
      >
        {children}
      </main>
      <Footer className={footerClassNames} />
    </div>
  );
}
