import Divider from '@/components/misc/BiasLabel/Divider';

type Props = {
  children: React.ReactNode;
};

export default function QualityStandards({ children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-md font-bold">Quality Standards</h2>
        <Divider />
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
