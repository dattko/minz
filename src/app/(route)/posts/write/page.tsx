'use client';
import React, { useState } from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import { InputWrap, Input } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';




const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content });
  };

  return (
    <ContentWrap>
      <Content title='게시글 작성'>
        <form onSubmit={handleSubmit}>
          <InputWrap>
            <Input
              required
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputWrap>

          <Btn type="submit" variant='outline-primary'>게시글 작성</Btn>
        </form>
      </Content>
    </ContentWrap>
  );
};

export default CreatePost;