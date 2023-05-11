import { ListStandardItem } from '@/components/misc/BiasLabel/ListStandard';

export default function Item({ text, content }: ListStandardItem) {
  return (
    <div className="my-2 flex flex-row justify-between text-sm">
      <span>{text}</span>
      {content}
    </div>
  );
}
