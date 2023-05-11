import React from 'react';

import ParticipantCell from '@/cells/ParticipantCell';
import AdminLayout from '@/layouts/AdminLayout';

export default function ParticipantPage() {
  return (
    <AdminLayout>
      <ParticipantCell />
    </AdminLayout>
  );
}
