import { SVGProps } from 'react';

type Props = {
  rotationDegrees: number;
  fillFirst?: string;
  fillSecond?: string;
  fillThird?: string;
};

const SvgComponent = ({
  rotationDegrees = 0,
  fillFirst = '#FFF',
  fillSecond = '#FFF',
  fillThird = '#FFF',
  ...props
}: SVGProps<SVGSVGElement> & Props) => (
  <svg
    viewBox={'0 0 105 56'}
    preserveAspectRatio="true"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      style={{
        transformOrigin: '50% 80%',
        transform: `rotate(${rotationDegrees - 90}deg)`,
        transformBox: 'fill-box',
      }}
      d="M53.161 55.991a3.26 3.26 0 1 1-3.63-5.413V30.742h.075a1 1 0 0 1 .071-.372l1.097-2.742c.335-.838 1.522-.838 1.857 0l1.097 2.742a1 1 0 0 1 .071.372h.08v20.652l.032.046a3.26 3.26 0 0 1-.75 4.55Z"
      fill="#000"
    />
    <path
      d="M16.425 16.425A50.959 50.959 0 0 0 1.83 46.678c-.467 4.09 2.911 7.28 6.792 7.28 3.978 0 6.973-3.212 7.517-6.881a36.717 36.717 0 0 1 72.639 0c.544 3.669 3.539 6.88 7.517 6.88 3.881 0 7.259-3.19 6.793-7.279A50.961 50.961 0 0 0 52.457 1.5a50.958 50.958 0 0 0-36.032 14.925Z"
      fill={fillThird}
      stroke="#000"
      strokeWidth={3}
    />
    <path
      d="M8.62 52.458c-3.103 0-5.653-2.525-5.3-5.61a49.46 49.46 0 0 1 2.825-11.746c1.09-2.907 4.508-3.995 7.273-2.583 2.765 1.412 3.817 4.79 2.826 7.732a38.205 38.205 0 0 0-1.59 6.606c-.454 3.07-2.929 5.6-6.033 5.6Z"
      fill={fillFirst}
    />
    <path
      d="M5.82 35.996a49.458 49.458 0 0 1 18.617-24.293l6.37 9.264A38.216 38.216 0 0 0 16.42 39.738L5.82 35.996Z"
      fill={fillSecond}
    />
    <path
      stroke="#000"
      strokeWidth={3}
      d="m24.979 10.757 7.633 10.798M4.6 36.374l11.956 4.347"
    />
  </svg>
);

export default SvgComponent;
