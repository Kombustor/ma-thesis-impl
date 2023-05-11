import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function CenterLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-around">
      {children}
    </div>
  );
}
