import React from 'react';

type Props = {
  condition: boolean;
  wrapper: (component: React.ReactNode) => React.ReactElement;
  children: React.ReactElement;
};

export function ConditionalWrap({
  condition,
  wrapper,
  children,
}: Props): React.ReactElement {
  return condition ? wrapper(children) : children;
}
