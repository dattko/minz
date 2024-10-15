import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import CreatePostForm from './CreatePostForm';
import { redirect } from 'next/navigation';
import { getUserInfo } from '@/components/auth/authSection/action';
import { createClient } from '@/lib/supabase/supabaseServer';

interface CreatePostProps {
  searchParams: { category?: string };
}

const CreatePost = async ({ searchParams }: CreatePostProps) => {
  const user = await getUserInfo();
  const categorySlug = searchParams.category;

  if (!user) {
    redirect('/auth/login');
  }

  let title = '';
  
  if (categorySlug) {
    const supabase = createClient();
    const { data: categoryData, error } = await supabase
      .from('categories')
      .select('name')
      .eq('slug', categorySlug)
      .single();

    if (error) {
      console.error('Error fetching category details:', error);
    } else if (categoryData) {
      title = categoryData.name;
    }
  }

  return (
    <ContentWrap>
      <Content title={title}>
        <CreatePostForm categorySlug={categorySlug || ''} />
      </Content>
    </ContentWrap>
  );
};

export default CreatePost;