import React from 'react';
import { Steps as DSteps } from 'react-daisyui';

export type Props = {
  edit?: boolean;
  classify?: boolean;
};

export default function Steps({ edit, classify }: Props) {
  return (
    <div className="flex flex-row justify-center">
      <DSteps>
        <DSteps.Step className="min-w-10" color="primary">
          Load
        </DSteps.Step>
        <DSteps.Step color={edit ? 'primary' : undefined}>Edit</DSteps.Step>
        <DSteps.Step color={classify ? 'primary' : undefined}>
          Classify
        </DSteps.Step>
      </DSteps>
    </div>
  );
}
