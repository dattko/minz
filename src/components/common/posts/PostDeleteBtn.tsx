'use client';
import React from 'react';
import Btn from '../button/Btn';
import { deletePosts } from '@/lib/action/postsAction';

interface PostsDeleteBtnProps {
  id: number;
  categorySlug: string;
}

const PostsDeleteBtn : React.FC<PostsDeleteBtnProps> = ({id, categorySlug}) => {

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까? 관련된 모든 이미지도 함께 삭제됩니다.')) {
      try {
        await deletePosts(id, categorySlug);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('게시물 삭제에 실패했습니다.');
      }
    }
  };



  return (
    <Btn size='small' variant='outline-secondary' onClick={handleDelete}>삭제</Btn>
  );
}

export default PostsDeleteBtn;