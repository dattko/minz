import React from 'react';
import PostDetail from '@/components/common/posts/PostsDetail';
import { notFound } from 'next/navigation';
import { getPostDetail } from '@/lib/action/postsAction';
import { getUserInfo } from '@/components/auth/authSection/action';
import { checkUserRecommendation, incrementViewCount } from '@/lib/action/postsAction';
import {fetchComments} from '@/lib/action/commentAction';
import styles from './PostPage.module.scss';
import Comments from '@/components/common/comments/Comments';

interface PostPageProps {
  params: { slug: string; id: number };
}


const PostPage: React.FC<PostPageProps> = async ({ params }) => {

  const user = await getUserInfo();
  const post = await getPostDetail(params.slug, params.id);
  const viewCount = await incrementViewCount(params.id);
  const initialComments = await fetchComments(params.id);
  let isRecommended = false;
  
  if (user) {
    isRecommended = await checkUserRecommendation(params.id, user.id);
  }
  

  if (!post) {
    notFound();
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
        views={viewCount.views}
        isRecommended={isRecommended}
        nickname={user?.nickname}
      />
      <footer className={styles.posts__footer}>
        <Comments postId={post.id} userInfo={user} initialComments={initialComments}/>
      </footer>
    </article>
  );
}

export default PostPage;