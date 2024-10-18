import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import { getUserInfo } from '@/components/auth/authSection/action';
import List from '@/components/common/list/List';
import styles from './MyPage.module.scss';

const MyPostsPage: React.FC = async () => {
  const user = await getUserInfo();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <ContentWrap>
      <Content title="내 게시글">
        ss
        {/* <List 
          categorySlug="myposts" 
          showViews={true} 
          simple={false} 
        /> */}
      </Content>
    </ContentWrap>
  );
}

export default MyPostsPage;