'use client';
import React, { useRef, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputWrap, Input } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import Tiptap from '@/components/editor/Editor';
import { createPosts, updatePosts } from '@/lib/action/postsAction';
import { EditPost, Posts } from '@/types/dataType';

interface PostFormProps {
  categorySlug: string;
  initialData?: Posts;
}

const PostForm: React.FC<PostFormProps> = ({ categorySlug, initialData }) => {
  const editorRef = useRef<{ getHTML: () => string; getLocalImages: () => any[]; setContent: (content: string) => void }>(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
    }
  }, [initialData]);

  useEffect(() => {
    if (isEditorReady && initialData && editorRef.current) {
      editorRef.current.setContent(initialData.content);
    }
  }, [isEditorReady, initialData]);

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
    
    const rawLocalImages = editorRef.current?.getLocalImages() || [];
    const serializableLocalImages = await Promise.all(rawLocalImages.map(async img => ({
      id: img.id,
      url: img.url,
      base64: await fileToBase64(img.file),
      type: img.file.type
    })));

    const postData: EditPost = {
      title,
      content: editorRef.current?.getHTML() || '',
      localImages: serializableLocalImages,
      category_slug: categorySlug,
    };

    try {
      if (initialData) {
        await updatePosts({ ...postData, id: initialData.id });
      } else {
        await createPosts(postData);
      }
    } catch (error) {
      console.error('작성/수정 에러:', error);
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </InputWrap>
      <Tiptap 
        ref={editorRef} 
        onReady={() => setIsEditorReady(true)}
        initialContent={initialData?.content}
      />
      <div className='btn-row'>
        <Btn type="submit" variant='outline-primary'>
          {initialData ? '게시글 수정' : '게시글 작성'}
        </Btn>
        <Btn type="button" variant='outline-secondary' onClick={handleCancel}>취소</Btn>
      </div>
    </form>
  );
};

export default PostForm;