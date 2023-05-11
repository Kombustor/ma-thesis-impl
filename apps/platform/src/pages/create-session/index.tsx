import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Select } from 'react-daisyui';

import MainLayout from '@/layouts/MainLayout';

import { FeedbackMechanism } from '@mbg/api-platform/models/enums';

export const getServerSideProps: GetServerSideProps = async () => {
  // If the prolific API token is set we only allow sessions with real prolific ids
  if (process.env.PROLIFIC_API_TOKEN) {
    return {
      redirect: {
        destination:
          '/error?error=PROLIFIC_API_TOKEN environment variable is set, can only join study via prolific',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default function CreateSessionPage() {
  const [forcedMechanism, setForcedMechanism] = useState<
    FeedbackMechanism | undefined
  >();

  return (
    <MainLayout>
      <p className="font-2xl mb-2">
        This is for testing the study without Prolific. Please click the button
        below to create a session and start the study.
        <br />
        Please avoid doing this multiple times unneccessarily, as it will create
        multiple sessions in the database.
      </p>

      <Select<FeedbackMechanism | undefined>
        className="mb-2"
        value={forcedMechanism}
        onChange={(e) => setForcedMechanism(e)}
      >
        {[
          <Select.Option key="default" value={undefined} label="Auto assign" />,
          ...Object.values(FeedbackMechanism).map((mechanism) => (
            <Select.Option key={mechanism} value={mechanism}>
              {mechanism}
            </Select.Option>
          )),
        ]}
      </Select>
      <Link
        href={`/create-session/go${
          forcedMechanism ? `?forcedMechanism=${forcedMechanism}` : ''
        }`}
      >
        <Button fullWidth>Create Session</Button>
      </Link>
    </MainLayout>
  );
}
