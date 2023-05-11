import { Button } from 'react-daisyui';
import { HiClipboardList } from 'react-icons/hi';

type Props = {
  url: string;
};

export default function QuestionnaireLink({ url }: Props) {
  return (
    <div className="questionnaire-link mt-4 flex w-full flex-row flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-6 py-4 md:flex-nowrap">
      <span className="font-semibold">
        Share your thoughts and help our research in our user experience survey!
      </span>
      <a
        className="umami--click--open-questionnaire w-full md:w-auto md:max-w-xs"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <Button
          className="w-full whitespace-nowrap md:w-auto"
          startIcon={<HiClipboardList />}
        >
          Participate now!
        </Button>
      </a>
    </div>
  );
}
