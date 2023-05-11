type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Subsection({ title, children }: Props) {
  return (
    <div className="flex flex-col gap-4 p-3">
      <h2 className="text-2xl">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
