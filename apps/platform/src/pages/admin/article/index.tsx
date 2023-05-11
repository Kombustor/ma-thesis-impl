import React from 'react';

import ArticlesCell from '@/cells/ArticleCell';
import AdminLayout from '@/layouts/AdminLayout';

export default function ArticleIndex() {
  return (
    <AdminLayout>
      <ArticlesCell />
    </AdminLayout>
  );
}
