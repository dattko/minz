import React from 'react';
import styles from './Page.module.scss';
import { Content, ContentWrap } from '@/components/common/content';
import List from '@/components/common/list/List';

export default function Home() {
  return (
    <ContentWrap col={2}>
      <Content title='공지사항' link="/posts/lists/notice" className='notice' >
        <List categorySlug="notice" simple limit={15} pagenation={false}/>
      </Content>
      <Content title='주간 베스트' className='popular' link="/posts/lists/popular">
        <List categorySlug="popular" showViews simple limit={15} pagenation={false}/>
      </Content>
      <Content title='최신 글'>
        <List categorySlug="recent" simple limit={15} pagenation={false}/>
      </Content>
      <Content title='자유 게시판' link="/posts/lists/free">
        <List categorySlug="free" simple limit={15} pagenation={false}/>
      </Content>
      <Content title='정보 게시판' link="/posts/lists/info">
        <List categorySlug="info" simple limit={15} pagenation={false}/>
      </Content>
      <Content title='질문 게시판' link="/posts/lists/question">
        <List categorySlug="question" simple limit={15} pagenation={false} />
      </Content>
    </ContentWrap>
  );
}

export const revalidate = 60;