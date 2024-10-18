import React from 'react';
import Link from 'next/link';
import styles from './List.module.scss';
import Text from '@/components/text/Text';
import { Eye, Heart } from 'lucide-react';
import { formatDate } from '@/utils/utils';
import { getPostsByCategory } from '@/lib/action/postsAction';
import Pagination from '@/components/common/pagination/Pagination';

interface ListProps {
  categorySlug: string;
  showViews?: boolean;
  simple?: boolean;
  limit?: number;
  basePath?: string;
  currentPage?: number;  // 현재 페이지를 props로 받습니다.
}

const List: React.FC<ListProps> = async ({ 
  categorySlug, 
  showViews = false, 
  simple = false, 
  limit = 30, 
  basePath,
  currentPage
}) => {
  const { posts, total } = await getPostsByCategory(categorySlug, limit, currentPage);
  const totalPages = Math.ceil(total / limit);

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
            {!simple && (
              <div className={styles.list__author}>
                <Text variant='p' fontSize='xs'>{post.author}</Text>
              </div>
            )}
            {(showViews || !simple) && (
              <div className={styles.list__views}>
                <Eye size={12} color='gray'/>
                <Text variant='p' fontSize='xs' color='gray'>{post.unique_views}</Text>
              </div>
            )}
            {!simple && (
              <div className={styles.list__views}>
                <Heart size={12} color='gray'/>
                <Text variant='p' fontSize='xs' color='gray'>{post.recommendations}</Text>
              </div>
            )}
            <div className={styles.list__info}>
              <Text variant='p' color='gray' fontSize='xs'>
                {simple ? formatDate(post.created_at, { showTime: false, dateStyle: 'short' }) : formatDate(post.created_at,{dateStyle: 'short', timeStyle: 'short'})}
              </Text>
            </div>
          </li> 
        ))}
      </ul>
      {currentPage && totalPages > 1 && (
        <Pagination
          initialPage={currentPage}
          totalPages={totalPages}
          basePath={basePath || `/posts/lists/${categorySlug}`}
        />
      )}
    </>
  );
};

export default List;