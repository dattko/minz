import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { notFound } from 'next/navigation';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';
import Btn from '@/components/common/button/Btn';
import styles from './CategoryPage.module.scss';
import Link from 'next/link';
import { getUserInfo } from '@/components/auth/authSection/action';

interface CategoryPageProps {
  params: { slug: string };
}

interface CategoryDetails {
  name: string;
  description?: string;
}

async function getCategoryDetails(slug: string): Promise<CategoryDetails | null> {
  if (slug === 'popular') {
    return { name: '오늘의 베스트' };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/categories?slug=eq.${slug}&select=name,description`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching category details:', error);
    return null;
  }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const [category, user] = await Promise.all([
    getCategoryDetails(params.slug),
    getUserInfo()
  ]);

  if (!category) {
    notFound();
  }

  const isAdmin = user?.usertype === 'Admin';
  const isNoticeCategory = params.slug === 'notice'; 

  const showWriteButton = params.slug !== 'popular' && (
    !isNoticeCategory || (isNoticeCategory && isAdmin)
  );

  return (
    <ContentWrap>
      <Content title={category.name} className={params.slug}>
        <List categorySlug={params.slug} showViews={params.slug === 'popular'} />
        <div className={styles.lists__option}>
          <div className={styles.lists__pagenation}></div>
          {showWriteButton && (
            <Link href={`/posts/write?category=${params.slug}`}>
              <Btn>작성하기</Btn>
            </Link>
          )}
        </div>
      </Content>
    </ContentWrap>
  );
}

export default CategoryPage;