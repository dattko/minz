import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: { categorySlug: string; id: string };
}

async function getPostDetail(categorySlug: string, id: string) {
  const query = `posts?select=*&id=eq.${id}&category_slug=eq.${categorySlug}`;
  try {
    const data = await fetchSupabaseData(query);
    const post = data[0];
    
    if (post) {
      // 카테고리 이름을 가져오기 위한 추가 쿼리
      const categoryQuery = `categories?select=name&slug=eq.${categorySlug}`;
      const categoryData = await fetchSupabaseData(categoryQuery);
      const categoryName = categoryData[0]?.name;

      return { ...post, categoryName };
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
      category={post.categoryName}
      categorySlug={post.category_slug}
    />
  );
}

export default PostPage;