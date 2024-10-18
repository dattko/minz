'use server'
import { ListItem } from '@/types/dataType';
import { fetchSupabaseData } from '../supabase/api';
export async function searchPosts(
  query: string,
  limit: number = 30,
  page: number = 1
): Promise<{ posts: ListItem[], total: number }> {
  const offset = (page - 1) * limit;
  let searchQuery = `posts?select=*,categories(name)`;

  searchQuery += `&or=(author.ilike.%${query}%,title.ilike.%${query}%,content.ilike.%${query}%)`;
  searchQuery += `&order=created_at.desc&limit=${limit}&offset=${offset}`;

  try {
    const [data, totalCountResult] = await Promise.all([
      fetchSupabaseData(searchQuery),
      fetchSupabaseData(`posts?select=count&or=(author.ilike.%${query}%,title.ilike.%${query}%,content.ilike.%${query}%)`)
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

    return {
      posts: data.map((post: any) => ({
        ...post,
        categoryName: post.categories?.name 
      })),
      total: totalCount
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    return { posts: [], total: 0 };
  }
}