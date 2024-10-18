import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { searchPosts } from '@/lib/action/serachAction';

interface SearchPageProps {
  searchParams: { q: string; page?: string };
}

const SearchPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const { q, page = '1' } = searchParams;
  const currentPage = parseInt(page, 10);

  try {
    const { posts, total } = await searchPosts(q, 30, currentPage);

    return (
      <ContentWrap>
        <Content title={`'${q}' 검색 결과`}>
          <List 
            posts={posts}
            total={total}
            showViews={true}
            currentPage={currentPage}
            basePath={`/search?q=${encodeURIComponent(q)}`}
            limit={30}
          />
        </Content>
      </ContentWrap>
    );
  } catch (error) {
    console.error('Error in SearchPage:', error);
    return (
      <ContentWrap>
        <Content title="검색 오류">
          <div>검색 결과를 불러오는 중 오류가 발생했습니다.</div>
        </Content>
      </ContentWrap>
    );
  }
};

export default SearchPage;