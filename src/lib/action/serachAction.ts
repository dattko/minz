'use server'

import { ListItem } from '@/types/dataType';
import { createClient } from '../supabase/supabaseServer';

export async function searchPosts(
  query: string,
  limit: number = 10
): Promise<{ 
  titleResults: ListItem[], 
  contentResults: ListItem[], 
  authorResults: ListItem[], 
  total: number 
}> {
  const supabase = createClient();
  try {
    console.log('Searching posts with query:', query);

    const [titleResults, contentResults, authorResults] = await Promise.all([
      // 제목 검색
      supabase
        .from('posts')
        .select(`
          *,
          categories(name, slug)
        `)
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit),

      // 내용 검색
      supabase
        .from('posts')
        .select(`
          *,
          categories(name, slug)
        `)
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit),

      // 작성자 검색
      supabase
        .from('posts')
        .select(`
          *,
          categories(name, slug)
        `)
        .ilike('author', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);

    if (titleResults.error) throw titleResults.error;
    if (contentResults.error) throw contentResults.error;
    if (authorResults.error) throw authorResults.error;

    const total = (titleResults.data?.length || 0) + 
                  (contentResults.data?.length || 0) + 
                  (authorResults.data?.length || 0);

    // 결과 데이터 형식 변환
    const formatResults = (results: any[]): ListItem[] => {
      return results.map(post => ({
        ...post,
        categoryName: post.categories?.name || '',
        category_slug: post.categories?.slug || '',
      }));
    };

    return {
      titleResults: formatResults(titleResults.data || []),
      contentResults: formatResults(contentResults.data || []),
      authorResults: formatResults(authorResults.data || []),
      total
    };
  } catch (error: any) {
    console.error('Detailed error in searchPosts:', error);
    throw new Error(`검색 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
  }
}