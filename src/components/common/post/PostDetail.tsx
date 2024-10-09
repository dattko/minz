import React from 'react';
import styles from './PostDetail.module.scss';
import { User } from 'lucide-react'; 
import { formatDate } from '@/utils/utils';
import { PostProps } from '@/types/dataType';
import Text from '@/components/text/Text';

const PostDetail: React.FC<PostProps> = ({
  title,
  content,
  author,
  createdAt,
  views,
  likes
}) => {
  return (
    <article className={styles.post__detail}>
      <header className={styles.post__header}>
        <div  className={styles.post__title}>
          <Text variant='h3'>{title}</Text>
        </div>
        <div className={styles.post__meta}>
          <div className={styles.post__author}>
            <User size={18} />
            <Text variant='p'>{author}</Text>
          </div>
          <Text variant='p'>{formatDate(createdAt)}</Text>
        </div>
      </header>
      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <footer className={styles.footer}>
        <div className={styles.stats}>
          <Text variant='p'>조회 {views}</Text>
          <Text variant='p'>좋아요 {likes}</Text>
        </div>
      </footer>
    </article>
  );
};

export default PostDetail;