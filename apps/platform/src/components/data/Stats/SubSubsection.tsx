type Props = {
  title: string;
  children: React.ReactNode;
};

export default function SubSubsection({ title, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className=" text-xl">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
