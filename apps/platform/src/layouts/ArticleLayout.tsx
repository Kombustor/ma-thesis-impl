import React from 'react';

import Steps, { Props as StepsProps } from '@/components/article/admin/Steps';
import AdminLayout from '@/layouts/AdminLayout';

type Props = {
  children: React.ReactNode;
};

export default function ArticleLayout({
  children,
  classify,
  edit,
}: Props & StepsProps) {
  return (
    <AdminLayout>
      <div className="m-auto flex h-full flex-col md:container md:mx-auto">
        <Steps classify={classify} edit={edit} />
        <div className="flex grow flex-col justify-center">{children}</div>
      </div>
    </AdminLayout>
  );
}
