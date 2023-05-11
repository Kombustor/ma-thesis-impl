import { Tooltip } from 'react-daisyui';

import {
  INDICATOR_CLASSES,
  INDICATOR_POSITION_CLASSES,
} from '@/components/feedback/utils';

import { classNames } from '@mbg/ui';

type Props = {
  explanation: string;
};

export default function MarkedIcon({ explanation }: Props) {
  return (
    <Tooltip className={INDICATOR_POSITION_CLASSES} message={explanation}>
      <svg
        width="1em"
        height="1em"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classNames(INDICATOR_CLASSES, 'animate-pulse')}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.642 1.857a.464.464 0 0 1 .447.337l.503 1.762a2.322 2.322 0 0 0 1.594 1.595l1.762.503a.464.464 0 0 1 0 .893l-1.762.503a2.321 2.321 0 0 0-1.594 1.595l-.503 1.762a.464.464 0 0 1-.893 0l-.503-1.762A2.322 2.322 0 0 0 2.098 7.45L.336 6.947a.464.464 0 0 1 0-.893l1.762-.503a2.321 2.321 0 0 0 1.595-1.595l.503-1.762a.464.464 0 0 1 .446-.337ZM10.213 0a.464.464 0 0 1 .451.352l.16.641a1.629 1.629 0 0 0 1.182 1.183l.641.16a.465.465 0 0 1 0 .9l-.64.16a1.628 1.628 0 0 0-1.183 1.183l-.16.641a.464.464 0 0 1-.901 0l-.16-.641a1.625 1.625 0 0 0-1.182-1.183l-.642-.16a.464.464 0 0 1 0-.9l.642-.16A1.625 1.625 0 0 0 9.603.993l.16-.641a.464.464 0 0 1 .45-.352Zm-.928 8.358a.464.464 0 0 1 .44.317l.245.733c.092.277.309.494.586.587l.733.244a.464.464 0 0 1 0 .88l-.733.245a.928.928 0 0 0-.586.587l-.245.732a.464.464 0 0 1-.88 0l-.245-.732a.929.929 0 0 0-.587-.587l-.732-.244a.464.464 0 0 1 0-.88l.732-.245a.928.928 0 0 0 .587-.587l.245-.733a.464.464 0 0 1 .44-.317Z"
          fill="#000"
        />
      </svg>
    </Tooltip>
  );
}
