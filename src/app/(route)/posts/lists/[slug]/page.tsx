import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { notFound } from 'next/navigation';
import { getCategoryDetails } from '@/lib/action/postsAction';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params, searchParams }) => {
  const category = await getCategoryDetails(params.slug);

  if (!category) {
    notFound();
  }

  const currentPage = parseInt(searchParams.page || '1', 10);

  return (
    <ContentWrap>
      <Content title={category.name} className={params.slug}>
        <List 
          categorySlug={params.slug} 
          showViews={params.slug === 'popular'} 
          currentPage={currentPage}
        />
      </Content>
    </ContentWrap>
  );
}

export default CategoryPage;