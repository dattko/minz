import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import CreatePostForm from './CreatePostForm';

const CreatePost = () => {

  return (
    <ContentWrap>
      <Content title='게시글 작성'>
        <CreatePostForm/>
      </Content>
    </ContentWrap>
  );
};

export default CreatePost;