import React from 'react';
import Link from 'next/link';
import styles from './ResultPreview.module.scss';
import Text from '@/components/text/Text';
import { Eye, Heart } from 'lucide-react';
import { formatDate } from '@/utils/utils';
import { ListItem } from '@/types/dataType';

interface ResultPreviewProps {
  posts: ListItem[];
  searchQuery: string;
  maxLength?: number;
  contentText?: boolean
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ posts, searchQuery, maxLength = 200, contentText }) => {
  // 검색어를 포함한 텍스트에 <mark> 태그를 적용하여 JSX로 반환하는 함수
  const highlightSearchQuery = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi')); // 검색어로 텍스트 분할
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const removeHtmlTags = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // 모든 HTML 태그를 제거
  };
  
  const getPreview = (content: string) => {
    const contentWithoutImages = content.replace(/<img[^>]*>/g, ''); // 이미지 태그 제거
    const cleanContent = removeHtmlTags(contentWithoutImages); // HTML 태그 제거
  
    let preview = cleanContent.substring(0, maxLength);
    if (cleanContent.length > maxLength) {
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
                <Eye size={12} color='gray' />
                <Text variant='p' fontSize='xs' color='gray'>{post.unique_views}</Text>
              </div>
              <div className={styles.preview__views}>
                <Heart size={12} color='gray' />
                <Text variant='p' fontSize='xs' color='gray'>{post.recommendations}</Text>
              </div>
              <div className={styles.preview__date}>
                <Text variant='p' color='gray' fontSize='xs'>
                  {formatDate(post.created_at, { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
              </div>
            </div>
          </div>
          {contentText && (
          <div className={styles.preview__content}>
            <Text variant='p'>{getPreview(post.content)}</Text>
          </div>)}
        </li>
      ))}
    </ul>
  );
};

export default ResultPreview;
