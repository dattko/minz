'use client';
import React, { useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { InputWrap, Input } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import Tiptap from '@/components/editor/Editor';
import { createPosts } from '@/lib/action/postsAction';
import { CreatePosts } from '@/types/dataType';

interface CreatePostFormProps {
  categorySlug: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ categorySlug }) => {
  const editorRef = useRef<{ getHTML: () => string; getLocalImages: () => any[] }>(null);
  const router = useRouter();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const titleInput = form.elements.namedItem('title') as HTMLInputElement;

    const rawLocalImages = editorRef.current?.getLocalImages() || [];
    const serializableLocalImages = await Promise.all(rawLocalImages.map(async img => ({
      id: img.id,
      url: img.url,
      base64: await fileToBase64(img.file),
      type: img.file.type
    })));

    const postData: CreatePosts = {
      title: titleInput.value,
      content: editorRef.current?.getHTML() || '',
      localImages: serializableLocalImages,
      category_slug: categorySlug, // 직접 slug 사용
    };

    try {
      await createPosts(postData);
      // 서버 측에서 리다이렉트를 처리할 것입니다.
    } catch (error) {
      console.error('작성 에러 :', error);
      // 에러 처리 (예: 사용자에게 에러 메시지 표시)
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputWrap>
        <Input
          required
          placeholder="제목을 입력하세요"
          name='title'
        />
      </InputWrap>
      <Tiptap ref={editorRef} />
      <div className='btn-row'>
        <Btn type="submit" variant='outline-primary'>게시글 작성</Btn>
        <Btn type="button" variant='outline-secondary' onClick={handleCancel}>취소</Btn>
      </div>
    </form>
  );
};

export default CreatePostForm;