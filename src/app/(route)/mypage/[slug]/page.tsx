import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import { getUserInfo } from '@/components/auth/authSection/action';
import List from '@/components/common/list/List';
import { redirect } from 'next/navigation';

interface MyPostsPageProps {
  searchParams: { page?: string };
}

const MyPostsPage: React.FC<MyPostsPageProps> = async ({ searchParams }) => {
  const user = await getUserInfo();

  if (!user) {
    redirect('/login');
  }

  const currentPage = parseInt(searchParams.page || '1', 10);

  return (
    <ContentWrap>
      <Content title="내 게시글">
        <List 
          categorySlug="myposts" 
          simple={false} 
          basePath="/mypage/posts"
          showViews={true}
          currentPage={currentPage}
        />
      </Content>
    </ContentWrap>
  );
}

export default MyPostsPage;