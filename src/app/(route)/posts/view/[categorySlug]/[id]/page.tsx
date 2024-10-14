import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { redirect, notFound } from 'next/navigation';

interface PostPageProps {
  params: { categorySlug: string; id: string };
}

async function getPostDetail(categorySlug: string, id: string) {
  const query = `posts?select=*,categories!inner(name,slug)&id=eq.${id}`;
  try {
    const data = await fetchSupabaseData(query);
    const post = data[0];
    
    if (post && post.categories.slug === categorySlug) {
      return post;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post detail:', error);
    return null;
  }
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const post = await getPostDetail(params.categorySlug, params.id);

  if (!post) {
    notFound(); 
  }

  return (
      <PostDetail
        title={post.title}
        content={post.content}
        author={post.author}
        created_at={post.created_at}
        views={post.views}
        recommendations={post.recommendations}
        category={post.categories.name}
        categorySlug={post.categories.slug}
      />
  );
}

export default PostPage;