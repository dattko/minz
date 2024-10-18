import React from 'react';
import Link from 'next/link';
import styles from './List.module.scss';
import Text from '@/components/text/Text';
import { Eye, Heart } from 'lucide-react';
import { ListItem } from '@/types/dataType';
import { formatDate } from '@/utils/utils';
import Pagination from '@/components/common/pagination/Pagination';

interface ListProps {
  posts: ListItem[];
  categorySlug: string;
  showViews: boolean;
  currentPage: number;
  totalPages: number;
}

const List: React.FC<ListProps> = ({ 
  posts, 
  categorySlug, 
  showViews, 
  currentPage,
  totalPages
}) => {
  return (
    <>
      <ul className={styles.list__ul}>
        {posts.map((post) => (
          <li key={post.id} className={styles.list__li}>
            <div className={styles.list__title}>
              {(categorySlug === 'recent' || categorySlug === 'popular') && post.categoryName && (
                <Text variant='p' color='gray' fontSize='xs'>[{post.categoryName}]</Text>
              )}
              <Link href={`/posts/view/${post.category_slug}/${post.id}`}>
                <Text variant='p' ellipsis>{post.title}</Text>
              </Link>
              <Text variant='p' color='orange' fontSize='xs'>{post.comment_count}</Text>
            </div>
            <div className={styles.list__author}>
              <Text variant='p' fontSize='xs'>{post.author}</Text>
            </div>
            {showViews && (
              <div className={styles.list__views}>
                <Eye size={12} color='gray'/>
                <Text variant='p' fontSize='xs' color='gray'>{post.unique_views}</Text>
              </div>
            )}
            <div className={styles.list__views}>
              <Heart size={12} color='gray'/>
              <Text variant='p' fontSize='xs' color='gray'>{post.recommendations}</Text>
            </div>
            <div className={styles.list__info}>
              <Text variant='p' color='gray' fontSize='xs'>
                {formatDate(post.created_at, {dateStyle: 'short', timeStyle: 'short'})}
              </Text>
            </div>
          </li> 
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(newPage) => {
            // 여기서는 새 URL을 생성합니다.
            return `?page=${newPage}`;
          }} 
        />
      )}
    </>
  );
};

export default List;