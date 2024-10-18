import React from 'react';
import styles from './Page.module.scss';
import { Content, ContentWrap } from '@/components/common/content';
import List from '@/components/common/list/List';

export default function Home() {
  return (
    <ContentWrap col={2}>
      <Content title='공지사항' link="/posts/lists/notice" className='notice'>
        <List categorySlug="notice" simple limit={10} />
      </Content>
      <Content title='오늘의 베스트' className='popular' link="/posts/lists/popular">
        <List categorySlug="popular" showViews simple limit={10} />
      </Content>
      <Content title='최신 글'>
        <List categorySlug="recent" simple limit={10} />
      </Content>
      <Content title='자유 게시판' link="/posts/lists/free">
        <List categorySlug="free" simple limit={10} />
      </Content>
      <Content title='정보 게시판' link="/posts/lists/info">
        <List categorySlug="info" simple limit={10} />
      </Content>
      <Content title='질문 게시판' link="/posts/lists/question">
        <List categorySlug="question" simple limit={10} />
      </Content>
    </ContentWrap>
  );
}

export const revalidate = 60;