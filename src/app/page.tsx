import React from 'react'
import { Content, ContentWrap } from '@/components/common/content'
import List from '@/components/common/list/List'
import { getPostsByCategory } from '@/lib/action/postsAction'

export default async function Home() {
  // 초기 데이터를 서버에서 가져옴
  const [
    noticeData,
    popularData,
    recentData,
    freeData,
    infoData,
    questionData
  ] = await Promise.all([
    getPostsByCategory("notice", 15, 1),
    getPostsByCategory("popular", 15, 1),
    getPostsByCategory("recent", 15, 1),
    getPostsByCategory("free", 15, 1),
    getPostsByCategory("info", 15, 1),
    getPostsByCategory("question", 15, 1)
  ])

  return (
    <ContentWrap col={2}>
      <Content title='공지사항' link="/posts/lists/notice" className='notice'>
        <List 
          categorySlug="notice" 
          simple 
          limit={15} 
          pagenation={false}
          initialData={noticeData}
        />
      </Content>
      <Content title='주간 베스트' className='popular' link="/posts/lists/popular">
        <List 
          categorySlug="popular" 
          showViews 
          simple 
          limit={15} 
          pagenation={false}
          initialData={popularData}
        />
      </Content>
      <Content title='최신 글'>
        <List 
          categorySlug="recent" 
          simple 
          limit={15} 
          pagenation={false}
          initialData={recentData}
        />
      </Content>
      <Content title='자유 게시판' link="/posts/lists/free">
        <List 
          categorySlug="free" 
          simple 
          limit={15} 
          pagenation={false}
          initialData={freeData}
        />
      </Content>
      <Content title='정보 게시판' link="/posts/lists/info">
        <List 
          categorySlug="info" 
          simple 
          limit={15} 
          pagenation={false}
          initialData={infoData}
        />
      </Content>
      <Content title='질문 게시판' link="/posts/lists/question">
        <List 
          categorySlug="question" 
          simple 
          limit={15} 
          pagenation={false}
          initialData={questionData}
        />
      </Content>
    </ContentWrap>
  );
}
