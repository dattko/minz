import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { notFound } from 'next/navigation';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';
import Btn from '@/components/common/button/Btn';
import styles from './CategoryPage.module.scss';
import Link from 'next/link';
import { getUserInfo } from '@/components/auth/authSection/action';
import { getCategoryDetails } from '@/lib/action/postsAction';

interface CategoryPageProps {
  params: { slug: string };
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

export const revalidate = 60;