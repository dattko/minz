import React from 'react';
import styles from './PostsDetail.module.scss';
import { User, Eye, Heart, Ban } from 'lucide-react'; 
import { formatDate } from '@/utils/utils';
import Text from '@/components/text/Text';
import Comments from '../comments/Comments';
import { Comment, Posts } from '@/types/dataType';
import Btn from '../button/Btn';
import Link from 'next/link';
import { getUserInfo } from '@/components/auth/authSection/action';
import PostsDeleteBtn from './PostDeleteBtn';


// 가상 데이터
const initialComments: Comment[] = [
  {
    author: '관리자',
    date: '2021-07-01 12:00',
    content: '첫 번째 댓글입니다.',
    replies: [
      {
        author: '사용자1',
        date: '2021-07-01 12:30',
        content: '첫 번째 댓글에 대한 대댓글입니다.',
      },
      {
        author: '사용자2',
        date: '2021-07-01 12:45',
        content: '좋은 댓글입니다!',
      },
    ],
  },
  {
    author: '관리자',
    date: '2021-07-01 12:05',
    content: '두 번째 댓글입니다.',
    replies: [],
  },
  {
    author: '관리자',
    date: '2021-07-01 12:10',
    content: '세 번째 댓글입니다.',
    replies: [
      {
        author: '사용자3',
        date: '2021-07-01 12:50',
        content: '대댓글입니다.',
      },
    ],
  },
];

const PostsDetail: React.FC<Posts> = async({
  id,
  title,
  content,
  author,
  created_at,
  views,
  recommendations,
  category,
  category_slug,
}) => {

  const user = await getUserInfo();


  return (
    <article className={styles.posts__detail}>
      <div className={styles.posts__category}>
        <Text variant='h2' fontSize='sm' color='blue'>{category}</Text>
      </div>
      <header className={styles.posts__header}>
        <div className={styles.posts__title__wrap}>
          <div className={styles.posts__title}>
            <Text variant='h4'>{title}</Text>
          </div>
          <div className={styles.posts__stats}>
            <div className={styles.posts__stat}>
              <Eye size={14} />
              <Text variant='p' fontSize='sm'>{views}</Text>
            </div>
            <div className={styles.posts__stat}>
              <Heart size={14} />
              <Text variant='p' fontSize='sm'>{recommendations}</Text>
            </div>
          </div>
        </div>
        <div className={styles.posts__meta}>
          <div className={styles.posts__author}>
            <User size={14} />
            <Text variant='p' fontSize='sm'>{author}</Text>
          </div>
          <div className={styles.posts__date}>
            <Text variant='p' fontSize='sm' color='gray'>{formatDate(created_at)}</Text>
          </div>
        </div>
      </header>
      <div 
        className={styles.posts__content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className={styles.posts__option}>
          <div>
            {user?.nickname === author && (
              <>
                <Link href={`/posts/edit/${id}?category=${category_slug}`}>
                  <Btn size='small' variant='outline-secondary'>수정</Btn>
                </Link>
                <PostsDeleteBtn id={id} categorySlug={category_slug}/>
              </>
            )}
          </div>
        <div>
          <Btn size='small' variant='primary'><Heart size={12}/> 추천</Btn>
          {/* <Btn size='small' variant='accent'><Ban size={12}/>신고</Btn> */}
          <Link href={`/posts/lists/${category_slug}`}>
            <Btn size='small' variant='secondary'>목록</Btn>
          </Link>

        </div>
      </div>
      <footer className={styles.posts__footer}>
        <Comments postId={1} initialComments={initialComments} />
      </footer>
    </article>
  );
};

export default PostsDetail;