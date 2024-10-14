import React from 'react';
import styles from './Page.module.scss';
import { Content, ContentWrap } from '@/components/common/content';
import List from '@/components/common/list/List';

export default function Home() {
  return (
    <ContentWrap col={2}>
      <Content title='공지사항'>
        <List categorySlug="notice" />
      </Content>
      <Content title='오늘의 베스트'>
        <List categorySlug="best" showViews/>
      </Content>
      <Content title='최신 글'>
        <List categorySlug="recent" />
      </Content>
      <Content title='자유 게시판'>
        <List categorySlug="free"  />
      </Content>
      <Content title='정보 게시판'>
        <List categorySlug="info" />
      </Content>
      <Content title='질문 게시판'>
        <List categorySlug="question" />
      </Content>
    </ContentWrap>
  );
}