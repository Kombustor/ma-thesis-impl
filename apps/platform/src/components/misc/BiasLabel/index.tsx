import React from 'react';
import { HiInformationCircle } from 'react-icons/hi';

import Card from '@/components/layout/Card';
import Divider from '@/components/misc/BiasLabel/Divider';
import InfoModal from '@/components/misc/BiasLabel/InfoModal';
import QualityStandards from '@/components/misc/BiasLabel/QualityStandards';
import BiasedLanguage from '@/components/misc/BiasLabel/QualityStandards/BiasedLanguage';
import Objectivity from '@/components/misc/BiasLabel/QualityStandards/Objectivity';
import Reporting from '@/components/misc/BiasLabel/QualityStandards/Reporting';
import Summary from '@/components/misc/BiasLabel/Summary';

import { QualityStandards as Props } from '@mbg/api-platform/schemas/article.schema';
import { classNames } from '@mbg/ui';

export default function BiasLabel({
  summary,
  language,
  reporting,
  objectivity,
  ...props
}: Props & React.ComponentProps<'div'>) {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <InfoModal open={modalOpen} close={() => setModalOpen(false)} />
      <Card
        {...props}
        disableMargin
        disablePadding
        className={classNames('flex flex-col gap-2 p-5', props.className)}
      >
        <div>
          <h1 className="flex flex-row items-center gap-1 text-xl font-bold">
            Article Breakdown
            <HiInformationCircle
              className="cursor-pointer"
              onClick={() => setModalOpen(true)}
            />
          </h1>
          <Divider />
        </div>
        <Summary {...summary} />
        <QualityStandards>
          {language && <BiasedLanguage {...language} />}
          {reporting && <Reporting {...reporting} />}
          {objectivity && <Objectivity {...objectivity} />}
        </QualityStandards>
        <Divider />
      </Card>
    </>
  );
}
