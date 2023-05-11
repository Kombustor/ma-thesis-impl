import React from 'react';

import BiasGauge from '@/components/BiasGauge';

import { SETUP_CONFIG } from '@mbg/api-platform/setupconfig';
import { classNames } from '@mbg/ui';

export type GaugeProps = {
  percentage: number;
  label: string;
};

export default function Gauge({
  percentage,
  label,
  ...props
}: GaugeProps & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames('flex flex-col items-center', props.className)}
    >
      <BiasGauge
        rotationDegrees={percentage * 180}
        fillFirst={
          percentage >= 0 &&
          percentage < SETUP_CONFIG.articles.biasThresholds[0]
            ? '#d3ffc8'
            : undefined
        }
        fillSecond={
          percentage >= SETUP_CONFIG.articles.biasThresholds[0] &&
          percentage < SETUP_CONFIG.articles.biasThresholds[1]
            ? '#FBFFC8'
            : undefined
        }
        fillThird={
          percentage >= SETUP_CONFIG.articles.biasThresholds[1]
            ? '#ffc8c8'
            : undefined
        }
        width="80%"
      />
      <div className="mt-1 text-center text-sm font-bold">{label}</div>
    </div>
  );
}
