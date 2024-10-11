'use client';
import React, { useState } from 'react';
import { InputWrap, Input } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import dynamic from 'next/dynamic';

const Tiptap = dynamic(() => import('@/components/editor/Editor'), { ssr: false })

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content });
  };

  return (
        <form onSubmit={handleSubmit}>
          <InputWrap>
            <Input
              required
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputWrap>
            <Tiptap/>
          <div className='btn-row'>
            <Btn type="submit" variant='outline-primary'>게시글 작성</Btn>
            <Btn variant='outline-secondary'>취소</Btn>
          </div>
        </form>
  );
};

export default CreatePostForm;