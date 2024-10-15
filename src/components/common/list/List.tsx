import React from 'react';
import Link from 'next/link';
import styles from './List.module.scss';
import Text from '@/components/text/Text';
import { Eye, Heart } from 'lucide-react';
import { ListItem } from '@/types/dataType';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { formatDate } from '@/utils/utils';

interface ListProps {
  categorySlug: string;
  showViews?: boolean;
  simple?: boolean;
  limit?: number;
}

async function getPostsByCategory(categorySlug: string, limit: number): Promise<ListItem[]> {
  let query = `posts?select=*,category_slug`;

  switch(categorySlug) {
    case 'recent':
      query += `&order=created_at.desc`;
      break;
    case 'popular':
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query += `&created_at=gte.${oneWeekAgo}&order=views.desc,created_at.desc`;
      break;
    default:
      query += `&category_slug=eq.${categorySlug}&order=created_at.desc`;
  }

  query += `&limit=${limit}`;

  try {
    const data = await fetchSupabaseData(query);
    // 카테고리 이름을 가져오기 위한 추가 쿼리
    const categoryNames = await fetchSupabaseData(`categories?select=slug,name`);
    const categoryMap = new Map(categoryNames.map((cat: any) => [cat.slug, cat.name]));

    return data.map((post: any) => ({
      ...post,
      categoryName: categoryMap.get(post.category_slug),
      categorySlug: post.category_slug
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

const List: React.FC<ListProps> = async ({ categorySlug, showViews = false, limit = 30, simple }) => {
  const posts = await getPostsByCategory(categorySlug, limit);

  return (
    <ul className={styles.list__ul}>
      {posts.map((post) => (
        <li key={post.id} className={styles.list__li}>
          <div className={styles.list__title}>
            {(categorySlug === 'recent' || categorySlug === 'popular') && post.categoryName && (
              <Text variant='p' color='gray' fontSize='xs'>[{post.categoryName}]</Text>
            )}
            <Link href={`/posts/view/${post.categorySlug}/${post.id}`}>
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
              <Text variant='p' fontSize='xs' color='gray'>{post.views}</Text>
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
  );
};

// 강제로 동적 렌더링을 활성화
export const dynamic = 'force-dynamic';

export default List;