import React from 'react';

type Props = {
  text: string;
  addons?: React.ReactNode;
};

export default function PageHeader({ text, addons }: Props) {
  return (
    <div className="mb-2">
      <div className="inline-block text-2xl font-bold">{text}</div>
      <div className="ml-2 inline-block">{addons}</div>
    </div>
  );
}
