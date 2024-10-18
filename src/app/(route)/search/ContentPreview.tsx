import React from 'react';
import Link from 'next/link';
import styles from './ContentPreview.module.scss';
import Text from '@/components/text/Text';
import { Eye, Heart } from 'lucide-react';
import { formatDate } from '@/utils/utils';
import { ListItem } from '@/types/dataType';

interface ContentPreviewProps {
  posts: ListItem[];
  searchQuery: string;
  maxLength?: number;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ posts, searchQuery, maxLength = 100 }) => {
  const highlightSearchQuery = (text: string, query: string) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const getPreview = (content: string) => {
    const contentWithoutImages = content.replace(/<img[^>]*>/g, '');
  
    let preview = contentWithoutImages.substring(0, maxLength);
    if (contentWithoutImages.length > maxLength) {
      preview += '...';
    }
    return highlightSearchQuery(preview, searchQuery);
  };
  

  return (
    <ul className={styles.preview__ul}>
      {posts.map((post) => (
        <li key={post.id} className={styles.preview__li}>
          <div className={styles.preview__header}>
            <div className={styles.preview__title}>
              {post.categoryName && (
                <Text variant='p' color='gray' fontSize='xs'>[{post.categoryName}]</Text>
              )}
              <Link href={`/posts/view/${post.category_slug}/${post.id}`}>
                <Text variant='p' ellipsis>{post.title}</Text>
              </Link>
              <Text variant='p' color='orange' fontSize='xs'>{post.comment_count}</Text>
            </div>
            <div className={styles.preview__info}>
              <div className={styles.preview__author}>
                <Text variant='p' fontSize='xs'>{post.author}</Text>
              </div>
              <div className={styles.preview__views}>
                <Eye size={12} color='gray'/>
                <Text variant='p' fontSize='xs' color='gray'>{post.unique_views}</Text>
              </div>
              <div className={styles.preview__views}>
                <Heart size={12} color='gray'/>
                <Text variant='p' fontSize='xs' color='gray'>{post.recommendations}</Text>
              </div>
              <div className={styles.preview__date}>
                <Text variant='p' color='gray' fontSize='xs'>
                  {formatDate(post.created_at, {dateStyle: 'short', timeStyle: 'short'})}
                </Text>
              </div>
            </div>
          </div>
          <div className={styles.preview__content}>
            <span dangerouslySetInnerHTML={{ __html: getPreview(post.content) }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContentPreview;