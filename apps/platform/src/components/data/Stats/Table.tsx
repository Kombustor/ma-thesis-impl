import { Table } from 'react-daisyui';

type Props = {
  children: React.ReactNode;
  headings?: string[];
};

export default function StatsTable({ children, headings }: Props) {
  return (
    <Table className="w-full" zebra>
      {headings && (
        <Table.Head>
          {headings.map((x, idx) => (
            <span key={idx}>{x}</span>
          ))}
        </Table.Head>
      )}
      <Table.Body>{children}</Table.Body>
    </Table>
  );
}
