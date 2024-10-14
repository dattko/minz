import React from 'react';
import Link from 'next/link';
import styles from './List.module.scss';
import Text from '@/components/text/Text';
import { Eye } from 'lucide-react';
import { ListItem } from '@/types/dataType';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { formatDate } from '@/utils/utils';

interface ListProps {
  categorySlug: string;
  showViews?: boolean;
  limit?: number;
}

async function getPostsByCategory(categorySlug: string, limit: number): Promise<ListItem[]> {
  let query = `posts?select=id,title,created_at,views,comment_count,categories!inner(slug,name)`;

  if (categorySlug === 'recent') {
    query = `posts?select=id,title,created_at,views,comment_count,categories(slug,name)&order=created_at.desc&limit=${limit}`;
  } else if (categorySlug === 'best') {
    query = `posts?select=id,title,created_at,views,comment_count,categories(slug,name)&order=views.desc&limit=${limit}`;
  } else {
    query += `&categories.slug=eq.${categorySlug}&order=created_at.desc&limit=${limit}`;
  }

  try {
    const data = await fetchSupabaseData(query);
    return data.map((post: any) => ({
      ...post,
      categoryName: post.categories ? post.categories.name : null,
      categorySlug: post.categories ? post.categories.slug : null
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

const List: React.FC<ListProps> = async ({ categorySlug, showViews = false, limit = 10 }) => {
  const posts = await getPostsByCategory(categorySlug, limit);

  return (
    <ul className={styles.list__ul}>
      {posts.map((post) => (
        <li key={post.id} className={styles.list__li}>
          <div className={styles.list__title}>
          {(categorySlug === 'recent' || categorySlug === 'best') && post.categoryName && (
              <Text variant='p' color='gray' fontSize='xs'>[{post.categoryName}]</Text>
            )}
            <Link href={`/posts/view/${post.id}`}>
              <Text variant='p' ellipsis>{post.title}</Text>
            </Link>
            <Text variant='p' color='orange' fontSize='xs'>{post.comment_count}</Text>
          </div>
          <div className={styles.list__info}>
            <Text variant='p' color='gray' fontSize='xs'>
              {formatDate(post.created_at, { showTime: false, dateStyle: 'short' })}
            </Text>
          </div>
          {showViews && (
            <div className={styles.list__views}>
              <Eye size={12} color='gray'/>
              <Text variant='p' fontSize='xs' color='gray'>{post.views}</Text>
            </div>
          )}
        </li> 
      ))}
    </ul>
  );
};

export default List;