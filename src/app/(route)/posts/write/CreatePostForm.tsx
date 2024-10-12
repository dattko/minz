import React, { useState } from 'react';
import { InputWrap, Input } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import Tiptap from '@/components/editor/Editor';
import dynamic from 'next/dynamic';

// const Tiptap = dynamic(() => import('@/components/editor/Editor'), { ssr: false, loading: () => <p>Loading...</p> });

const CreatePostForm = () => {


  return (
        <form  >
          <InputWrap>
            <Input
              required
              placeholder="제목을 입력하세요"
              name='title'
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