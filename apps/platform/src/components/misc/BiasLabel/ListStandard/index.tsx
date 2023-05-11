import React from 'react';

import Divider from '@/components/misc/BiasLabel/Divider';
import Item from '@/components/misc/BiasLabel/ListStandard/Item';

type Props = {
  title: string;
  items: ListStandardItem[];
};

export type ListStandardItem = {
  text: string;
  content: React.ReactNode;
};

export default function index({ title, items }: Props) {
  return (
    <div>
      <div className="text-md mb-0.5 font-bold">{title}</div>
      <Divider small />
      <div className="flex flex-col">
        <div className="block w-[92%] self-end">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <Item {...item} />
              {idx < items.length - 1 && <Divider small />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <Divider small />
    </div>
  );
}
