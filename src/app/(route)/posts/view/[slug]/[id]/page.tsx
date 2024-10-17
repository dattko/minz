import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { notFound } from 'next/navigation';
import { incrementViewCount } from '@/lib/action/postsAction';
import { Posts } from '@/types/dataType';

interface PostPageProps {
  params: { slug: string; id: string };
}

async function getPostDetail(slug: string, id: string): Promise<Posts | null> {
  const query = `posts?select=*,categories(name)&id=eq.${id}&category_slug=eq.${slug}`;
  try {
    const data = await fetchSupabaseData(query);
    let post = data[0];

    if (post) {
      const updatedViewCount = await incrementViewCount(id);
      
      post = {
        ...post,
        views: updatedViewCount.views,
        categoryName: post.categories?.name
      };

      return post;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post detail:', error);
    throw error; // 에러를 상위로 전파합니다
  }
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  try {
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
        category={post.categoryName || ''}
        category_slug={post.category_slug}
      />
    );
  } catch (error) {
    notFound(); 
  }
}

export default PostPage;