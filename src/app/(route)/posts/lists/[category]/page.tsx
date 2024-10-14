import React from 'react';
import { ContentWrap, Content } from '@/components/common/content';
import List from '@/components/common/list/List';
import { notFound } from 'next/navigation';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';

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
  const category = await getCategoryDetails(params.category);

  if (!category) {
    notFound();
  }

  return (
    <ContentWrap>
      <Content title={category.name}>
        {/* {category.description && <p>{category.description}</p>} */}
        <List categorySlug={category.slug} />
      </Content>
    </ContentWrap>
  );
}

export default CategoryPage;