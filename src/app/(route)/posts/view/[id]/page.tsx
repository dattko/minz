import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { redirect } from 'next/navigation';

interface PostPageProps {
  params: { id: string };
}

async function getPostDetail(id: string) {
  const query = `posts?select=*,categories(name)&id=eq.${id}`;
  try {
    const data = await fetchSupabaseData(query);
    return data[0]; // Assuming the query returns an array with one post
  } catch (error) {
    console.error('Error fetching post detail:', error);
    return null;
  }
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const post = await getPostDetail(params.id);

  if (!post) {
    return redirect('/');
  }

  return (
    <div>
      <PostDetail
        title={post.title}
        content={post.content}
        author={post.author}
        created_at={post.created_at}
        views={post.views}
        recommendations={post.recommendations}
        category={post.categories.name}
      />
    </div>
  );
}

export default PostPage;
