import React from 'react';
import styles from './PostsDetail.module.scss';
import { User, Eye, Heart } from 'lucide-react'; 
import { formatDate } from '@/utils/utils';
import Text from '@/components/text/Text';
import {Posts } from '@/types/dataType';
import Btn from '../button/Btn';
import Link from 'next/link';
import PostsDeleteBtn from './PostDeleteBtn';
import RecommendationBtn from './RecommendationBtn';

interface PostsDetailProps extends Posts {
  nickname?: string;
  isRecommended: boolean;
  author_id?: string;
}

const PostsDetail: React.FC<PostsDetailProps> = ({
  id,
  title,
  content,
  author,
  created_at,
  recommendations,
  category,
  category_slug,
  unique_views,
  isRecommended,
  user_id,
  author_id
}) => {


  return (
    <>
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
              <Text variant='p' fontSize='sm'>{unique_views}</Text>
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
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
      <div className={styles.posts__option}>
          <div>
            {user_id === author_id  && (
              <>
                <Link href={`/posts/edit/${id}?category=${category_slug}`}>
                  <Btn size='small' variant='outline-secondary'>수정</Btn>
                </Link>
                <PostsDeleteBtn id={id} categorySlug={category_slug}/>
              </>
            )}
          </div>
        <div>
        <RecommendationBtn id={id} initialRecommendations={recommendations} initiallyRecommended={isRecommended}/>
          {/* <Btn size='small' variant='accent'><Ban size={12}/>신고</Btn> */}
          <Link href={`/posts/lists/${category_slug}`}>
            <Btn size='small' variant='secondary'>목록</Btn>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostsDetail;