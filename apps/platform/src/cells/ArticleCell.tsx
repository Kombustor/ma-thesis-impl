import React from 'react';

import { Cell } from '@/cells/Cell';
import ArticleList from '@/components/article/admin/ArticleList';

export default function ArticlesCell() {
  return (
    <Cell
      query={['admin-article.find-many']}
      Success={({ data }) => <ArticleList data={data} />}
    />
  );
}
