import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function CenterLayout({ children }: Props) {
  return (
    <div className="max-w-screen flex min-h-screen items-center justify-around overflow-x-auto">
      {children}
    </div>
  );
}
