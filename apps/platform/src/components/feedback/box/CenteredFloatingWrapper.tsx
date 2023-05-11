import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  topRef: React.RefObject<HTMLSpanElement>;
  centerTargetRef: React.RefObject<HTMLSpanElement>;
  dependencies: unknown[];
  relativeToEnd?: boolean;
  children: React.ReactNode;
};

export default function CenteredFloatingWrapper({
  topRef,
  centerTargetRef,
  dependencies,
  children,
  relativeToEnd,
  ...props
}: Props & React.ComponentProps<'div'>) {
  const [currentOffsetTop, setCurrentOffsetTop] = React.useState(0);
  const [currentOffsetHeight, setCurrentOffsetHeight] = React.useState(0);

  const selfRef = React.useRef<HTMLDivElement>(null);

  // When changing the sentence, update the offsetTop & offsetHeight of the sentence element
  React.useEffect(() => {
    if (centerTargetRef.current) {
      setCurrentOffsetTop(
        centerTargetRef.current.offsetTop +
          (relativeToEnd ? centerTargetRef.current.offsetHeight / 2 : 0)
      );
      setCurrentOffsetHeight(centerTargetRef.current.offsetHeight);
    }
  }, [centerTargetRef, dependencies, relativeToEnd]);

  // Calculate the box offset when the sentence values change
  const topOffset = React.useMemo(() => {
    if (topRef.current && selfRef.current) {
      // Centers the feedback box on the current sentence
      return (
        currentOffsetTop -
        topRef.current.offsetTop -
        selfRef.current.offsetHeight / 2 +
        currentOffsetHeight / 2
      );
    }
    return 0;
  }, [currentOffsetTop, currentOffsetHeight, topRef, selfRef]);

  return (
    <div
      {...props}
      className={classNames(props.className, 'transition-all')}
      ref={selfRef}
      style={{
        marginTop: topOffset,
      }}
    >
      {children}
    </div>
  );
}
