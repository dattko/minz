import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { searchPosts } from '@/lib/action/serachAction';
import Text from '@/components/text/Text';
import ContentPreview from './ContentPreview';

interface SearchPageProps {
  searchParams: { q: string };
}

const SearchPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const { q } = searchParams;

  try {
    const { titleResults, contentResults, authorResults, total } = await searchPosts(q);
    if (total === 0) {
      return (
        <ContentWrap>
          <Content title={`'${q}' 검색 결과`}>
            <div>검색 결과가 없습니다.</div>
          </Content>
        </ContentWrap>
      );
    }

    return (
      <ContentWrap>
        <Text variant='h2' color='search'>{`'${q}' 검색 결과`}</Text>
        {titleResults.length > 0 && (
          <Content title={`제목 (${titleResults.length}건)`}>
            <List 
              posts={titleResults}
              total={titleResults.length}
              showViews={true}
              currentPage={1}
              basePath={`/search?q=${encodeURIComponent(q)}`}
            />
          </Content>
        )}
        {contentResults.length > 0 && (
          <Content title={`내용 (${contentResults.length}건)`}>
            <ContentPreview 
              posts={contentResults}
              searchQuery={q}
              maxLength={200}
            />
          </Content>
        )}
        {authorResults.length > 0 && (
          <Content title={`작성자 (${authorResults.length}건)`}>
            <List 
              posts={authorResults}
              total={authorResults.length}
              showViews={true}
              currentPage={1}
              basePath={`/search?q=${encodeURIComponent(q)}`}
            />
          </Content>
        )}
      </ContentWrap>
    );
  } catch (error: any) {
    console.error('Detailed error in SearchPage:', error);
    return (
      <ContentWrap>
        <Content title="검색 오류">
          <div>검색 중 오류가 발생했습니다: {error.message}</div>
          <div>잠시 후 다시 시도해주세요.</div>
        </Content>
      </ContentWrap>
    );
  }
};

export default SearchPage;