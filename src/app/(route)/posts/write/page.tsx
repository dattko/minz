import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import PostForm from '@/components/form/PostForm';
import { redirect, notFound } from 'next/navigation';
import { getUserInfo } from '@/components/auth/authSection/action';
import { getCategoryDetails } from '@/lib/action/postsAction';

interface WritePostPageProps {
  searchParams: { category?: string };
}

export default async function WritePostPage({ searchParams }: WritePostPageProps) {
  const user = await getUserInfo();
  const category_slug = searchParams.category;

  if (!user) {
    redirect('/auth/login');
  }

  if (!category_slug) {
    notFound();
  }

  const categoryData = await getCategoryDetails(category_slug);

  if (!categoryData) {
    notFound();
  }

  const title = `(작성) ${categoryData.name}`;

  return (
    <ContentWrap>
      <Content title={title}>
        <PostForm categorySlug={category_slug} />
      </Content>
    </ContentWrap>
  );
}