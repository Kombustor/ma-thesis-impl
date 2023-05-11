import { useState } from 'react';
import { Button, Input } from 'react-daisyui';

type Props = {
  loading: boolean;
  onSubmit: (newUrl: string) => void;
};

export default function NewImageForm({ loading, onSubmit }: Props) {
  const [newUrl, setNewUrl] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="New image url"
        value={newUrl}
        onChange={(e) => setNewUrl(e.currentTarget.value)}
      />
      <Button loading={loading} onClick={() => onSubmit(newUrl)}>
        Save
      </Button>
    </div>
  );
}
