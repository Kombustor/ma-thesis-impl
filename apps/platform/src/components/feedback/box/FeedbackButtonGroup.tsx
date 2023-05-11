import React from 'react';

type Props = {
  children: React.ReactNode;
};

export function FeedbackButtonGroup({ children }: Props) {
  return (
    <div className="mt-3 flex flex-wrap gap-3 overflow-auto">{children}</div>
  );
}
