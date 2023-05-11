import Head from 'next/head';
import React from 'react';

import Card from '@/components/layout/Card';
import MainLayout from '@/layouts/MainLayout';

import { ConditionalWrap, classNames } from '@mbg/ui';

import '@fontsource/lato';

import StudySteps from '@/components/layout/StudySteps';
import { PROGRESS_TO_LABEL } from '@/lib/progress-maps';

import { StudyProgress } from '@mbg/api-platform/models/enums';

type Props = {
  progress: StudyProgress;
  card?: boolean;
  centerButton?: boolean;
  children: React.ReactNode;
  nextButton?: React.ReactNode;
};

export default function StudyLayout({
  progress,
  card = true,
  children,
  nextButton,
  centerButton,
  ...props
}: Props & React.ComponentProps<typeof MainLayout>) {
  return (
    <MainLayout
      navigation={<StudySteps progress={progress} />}
      data-theme="studylight"
      className="bg-slate-100"
      {...props}
    >
      <Head>
        <title>{PROGRESS_TO_LABEL[progress]}</title>
      </Head>
      <div className="flex grow flex-col items-center justify-between gap-5">
        <div className="flex w-full grow flex-col items-center justify-center">
          <ConditionalWrap
            condition={card}
            wrapper={(children) => <Card>{children}</Card>}
          >
            <>{children}</>
          </ConditionalWrap>
          <div
            className={classNames('flex flex-col', {
              'items-end': !centerButton,
              'items-center': centerButton,
              'mx-auto w-3/4': card,
            })}
          >
            {nextButton}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
