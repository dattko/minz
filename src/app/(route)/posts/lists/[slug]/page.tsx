import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { notFound } from 'next/navigation';
import { getCategoryDetails } from '@/lib/action/postsAction';
import { getUserInfo } from '@/components/auth/authSection/action';
import Link from 'next/link';
import Btn from '@/components/common/button/Btn';
import styles from './CategoryPage.module.scss';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params, searchParams }) => {

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
  const currentPage = parseInt(searchParams.page || '1', 10);

  return (
    <ContentWrap>
      <Content title={category.name} className={params.slug}>
        <List 
          categorySlug={params.slug} 
          showViews={params.slug === 'popular'} 
          currentPage={currentPage}
        />
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