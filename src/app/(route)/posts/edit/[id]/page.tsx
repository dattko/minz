// app/posts/edit/[id]/page.tsx
import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import PostForm from '@/components/form/PostForm';
import { redirect } from 'next/navigation';
import { getUserInfo } from '@/components/auth/authSection/action';
import { createClient } from '@/lib/supabase/supabaseServer';
import { Posts } from '@/types/dataType';

interface PostEditPageProps {
  params: { id: string };
}

const PostEditPage = async ({ params }: PostEditPageProps) => {
  const user = await getUserInfo();
  const postId = params.id;

  if (!user) {
    redirect('/auth/login');
  }

  const supabase = createClient();
  let title = '';
  let initialData: Posts | undefined;

  // 게시글 데이터 가져오기 (카테고리 슬러그 포함)
  const { data: postData, error } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching post details:', error);
    redirect('/error?message=게시글을 찾을 수 없습니다');
  } else if (postData) {
    initialData = postData;
    title = `(수정) ${postData.categories.name}`;

    // 작성자 확인
    if (postData.author !== user.nickname) {
      redirect('/error?message=권한이 없습니다');
    }
  } else {
    redirect('/error?message=게시글을 찾을 수 없습니다');
  }

  return (
    <ContentWrap>
      <Content title={title}>
        <PostForm 
          categorySlug={postData.category_slug} 
          initialData={initialData}
        />
      </Content>
    </ContentWrap>
  );
};

export default PostEditPage;