import React from 'react';
import PostDetail from '@/components/common/post/PostDetail';

const noticePage = () => {
  // 임시 데이터
  const post = {
    id: '1',
    title: '중요 공지사항: 시스템 업데이트 안내',
    content: `
      <p>안녕하세요, 사용자 여러분.</p>
      <p>다가오는 주말, 2023년 5월 27일 토요일 오후 11시부터 5월 28일 일요일 오전 6시까지 시스템 업데이트가 진행될 예정입니다.</p>
      <p>업데이트 내용:</p>
      <ul>
        <li>성능 개선 및 버그 수정</li>
        <li>새로운 기능 추가: 실시간 알림 시스템</li>
        <li>사용자 인터페이스 개선</li>
      </ul>
      <p>업데이트 기간 동안 서비스 이용이 일시적으로 중단될 수 있습니다. 사용자 여러분의 양해 부탁드립니다.</p>
      <p>문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.</p>
      <p>감사합니다.</p>
    `,
    author: '관리자',
    created_at: '2023-05-25T09:00:00Z',
    views: 1520,
    likes: 45
  };

  return (
    <div>
      <PostDetail
        title={post.title}
        content={post.content}
        author={post.author}
        createdAt={post.created_at}
        views={post.views}
        likes={post.likes}
      />
    </div>
  );
}

export default noticePage;