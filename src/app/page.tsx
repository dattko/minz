import React from 'react';
import styles from './Page.module.scss';
import { Content, ContentWrap } from '@/components/common/content';
import List, {ListItem} from '@/components/common/list/List';

export default function Home() {
  const noticeItems: ListItem[] = [
    { id: 1, title: '공지사항 1', date: '2023-06-01', views: 100, link: '/notice/1' },
    { id: 2, title: '공지사항 2', date: '2023-06-02', views: 150, link: '/notice/2' },
    { id: 3, title: '공지사항 2', date: '2023-06-02', views: 150, link: '/notice/2' },
    { id: 4, title: '공지사항 2', date: '2023-06-02', views: 150, link: '/notice/2' },
    { id: 5, title: '공지사항 2', date: '2023-06-02', views: 150, link: '/notice/2' },
    { id: 6, title: '공지사항 2', date: '2023-06-02', views: 150, link: '/notice/2' },
  ];

  const bestItems: ListItem[] = [
    { id: 1, title: '인기글 1 assss인기글 1 assss인기글 1 assss인기글 1 assss인기글 1 assss', date: '2023-06-01', views: 500, link: '/best/1' },
    { id: 2, title: '인기글 2', date: '2023-06-02', views: 450, link: '/best/2' },

  ];


  return (
    <ContentWrap col={2}>
      <Content title='공지사항'>
        <List items={noticeItems} />
      </Content>
      <Content title='오늘의 베스트' >
        <List items={bestItems} showViews/>
      </Content>
      <Content title='최신 글' >
        ㅁㄴㅇ
      </Content>
      <Content title='정보 게시판' >
        ㅁㄴㅇ
      </Content>
      <Content title='자유 게시판' >
        ㅁㄴㅇ
      </Content>
    </ContentWrap>
  );
}
