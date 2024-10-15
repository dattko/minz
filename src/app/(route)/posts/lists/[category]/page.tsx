import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { notFound } from 'next/navigation';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';
import Btn from '@/components/common/button/Btn';
import styles from './CategoryPage.module.scss';
import Link from 'next/link';

interface CategoryPageProps {
  params: { category: string };
}

interface CategoryDetails {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

async function getCategoryDetails(slug: string): Promise<CategoryDetails | null> {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/categories?slug=eq.${slug}&select=*`, {
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
  let category: CategoryDetails | null = null;
  let title: string = '';
  let slug: string = params.category;
  
  if (params.category === 'popular') {
    title = '오늘의 베스트';
  } else {
    category = await getCategoryDetails(params.category);
    if (!category) {
      notFound();
    }
    title = category.name;
    slug = category.slug;
  }

  return (
    <ContentWrap>
      <Content title={title} className={slug}>
        <List categorySlug={slug} showViews={params.category === 'popular'} />
        <div className={styles.lists__option}>
          <div className={styles.lists__pagenation}></div>
          {params.category !== 'popular' && (
            <Link href="/posts/write">
              <Btn>작성하기</Btn>
            </Link>
          )}
        </div>
      </Content>
    </ContentWrap>
  );
}

export default CategoryPage;