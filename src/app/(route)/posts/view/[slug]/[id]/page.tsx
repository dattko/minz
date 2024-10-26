import { headers } from 'next/headers';
import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { notFound } from 'next/navigation';
import { getPostDetail, incrementViewCount, checkUserRecommendation } from '@/lib/action/postsAction';
import { getUserInfo } from '@/components/auth/authSection/action';
import { fetchComments } from '@/lib/action/commentAction';
import styles from './PostPage.module.scss';
import Comments from '@/components/common/comments/Comments';

interface PostPageProps {
  params: { slug: string; id: string };
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const user = await getUserInfo();
  const post = await getPostDetail(params.slug, parseInt(params.id));

  if (!post) {
    notFound();
  }

  const headersList = headers();
  const clientIp = headersList.get('x-forwarded-for') || 'unknown';
  let unique_views = post.unique_views;
  
  try {
    const result = await incrementViewCount(parseInt(params.id), clientIp);
    unique_views = result.unique_views;
  } catch (error) {
    console.error('Failed to increment view count:', error);
    // 여기서는 오류를 무시하고 기존 unique_views를 사용합니다.
  }

  const initialComments = await fetchComments(parseInt(params.id));

  let isRecommended = false;

  if (user) {
    isRecommended = await checkUserRecommendation(parseInt(params.id), user.id);
  }

  return (
    <article className={styles.posts__detail}>
      <PostDetail
        id={post.id}
        title={post.title}
        content={post.content}
        author={post.author}
        created_at={post.created_at}
        recommendations={post.recommendations}
        category={post.categoryName || ''}
        category_slug={post.category_slug}
        unique_views={unique_views}
        isRecommended={isRecommended}
        nickname={user?.nickname}
        author_id={post.user_id}
        user_id={user?.id || ''}
      />
      <footer className={styles.posts__footer}>
        <Comments postId={post.id} userInfo={user} initialComments={initialComments} />
      </footer>
    </article>
  );
};

export default PostPage;