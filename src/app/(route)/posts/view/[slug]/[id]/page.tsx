import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { notFound } from 'next/navigation';
import { incrementViewCount } from '@/lib/action/postsAction';

interface PostPageProps {
  params: { slug: string; id: string };
}

async function getPostDetail(slug: string, id: string) {
  const query = `posts?select=*&id=eq.${id}&category_slug=eq.${slug}`;
  try {
    const data = await fetchSupabaseData(query);
    const post = data[0];
    
    if (post) {
      // 카테고리 이름을 가져오기 위한 추가 쿼리
      const categoryQuery = `categories?select=name&slug=eq.${slug}`;
      const categoryData = await fetchSupabaseData(categoryQuery);
      const categoryName = categoryData[0]?.name;

      const updatedPost = await incrementViewCount(id);

      return { ...updatedPost, categoryName };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post detail:', error);
    return null;
  }
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const post = await getPostDetail(params.slug, params.id);

  if (!post) {
    notFound(); 
  }

  return (
    <PostDetail
      id={post.id}
      title={post.title}
      content={post.content}
      author={post.author}
      created_at={post.created_at}
      views={post.views}
      recommendations={post.recommendations}
      category={post.categoryName}
      category_slug={post.category_slug}
    />
  );
}

export default PostPage;