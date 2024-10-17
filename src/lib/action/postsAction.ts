'use server'
import { createClient } from '@/lib/supabase/supabaseServer'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { EditPost } from '@/types/dataType'
import { getUserInfo } from '@/components/auth/authSection/action'
import { Console } from 'console'

function extractImageUrls(content: string): string[] {
  const regex = /<img[^>]+src="?([^"\s]+)"?\s*/gi;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(content))) {
    urls.push(match[1]);
  }
  return urls;
}

export async function createPosts(postData: EditPost) {
  const supabase = createClient()
  const { title, content, localImages, category_slug } = postData;
  let postId: string
  try {
    const user = await getUserInfo()
    
    if (!user) {
      throw new Error('사용자 인증에 실패했습니다.')
    }

    const uploadedImages = await Promise.all(localImages.map(async (img) => {
      const fileExt = img.type.split('/')[1]
      const fileName = `${uuidv4()}.${fileExt}`
      const base64Data = img.base64.split(',')[1]
      const { data, error } = await supabase.storage
        .from('posts')
        .upload(fileName, Buffer.from(base64Data, 'base64'), {
          contentType: img.type
        })
      
      if (error) throw error
      
      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName)
      
      return { localUrl: img.url, uploadedUrl: urlData.publicUrl }
    }))

    let finalContent = content
    uploadedImages.forEach((img) => {
      finalContent = finalContent.replace(img.localUrl, img.uploadedUrl)
    })

    const { error } = await supabase
      .from('posts')
      .insert({ 
        title,
        content: finalContent,
        author: user.nickname,
        category_slug, 
        status: 'published'
      })
      .single()

    if (error) throw error
  } catch (error) {
    console.error('Error creating post:', error)
    return { errorMsg: (error as Error).message }
  }
  revalidatePath(`/posts/lists/${category_slug}`, 'layout')
  redirect(`/posts/lists/${category_slug}`)
}

export async function updatePosts(postData: EditPost) {
  const supabase = createClient()
  const { id, title, content, localImages, category_slug } = postData;

  try {
    const user = await getUserInfo()
    
    if (!user) {
      throw new Error('사용자 인증에 실패했습니다.')
    }

    // 기존 게시글 정보 가져오기
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author, content')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // 작성자 확인
    if (existingPost.author !== user.nickname) {
      throw new Error('수정 권한이 없습니다.')
    }

    // 기존 이미지 URL 추출
    const existingImageUrls = extractImageUrls(existingPost.content);

    // 새 이미지 업로드
    const uploadedImages = await Promise.all(localImages.map(async (img) => {
      if (img.url.startsWith('data:')) {  // 새로 추가된 이미지인 경우
        const fileExt = img.type.split('/')[1]
        const fileName = `${uuidv4()}.${fileExt}`
        const base64Data = img.base64.split(',')[1]
        const { data, error } = await supabase.storage
          .from('posts')
          .upload(fileName, Buffer.from(base64Data, 'base64'), {
            contentType: img.type
          })
        
        if (error) throw error
        
        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName)
        
        return { localUrl: img.url, uploadedUrl: urlData.publicUrl }
      }
      return { localUrl: img.url, uploadedUrl: img.url }  // 기존 이미지는 그대로 유지
    }))

    let finalContent = content
    uploadedImages.forEach((img) => {
      finalContent = finalContent.replace(img.localUrl, img.uploadedUrl)
    })

    // 사용되지 않는 기존 이미지 삭제
    const newImageUrls = extractImageUrls(finalContent);
    const unusedImages = existingImageUrls.filter(url => !newImageUrls.includes(url));
    await Promise.all(unusedImages.map(async (url) => {
      const path = new URL(url).pathname.split('/').pop();
      if (path) {
        const { error } = await supabase.storage
          .from('posts')
          .remove([path]);
        if (error) console.error('Error deleting unused image:', error);
      }
    }));

    // 게시글 업데이트
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        title,
        content: finalContent,
        category_slug,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error updating post:', error)
    return { errorMsg: (error as Error).message }
  }
  
  revalidatePath(`/posts/lists/${category_slug}`, 'layout')
  redirect(`/posts/view/${category_slug}/${id}`)
}

export async function deletePosts(postId: number, categorySlug: string) {
  const supabase = createClient()

  try {
    const user = await getUserInfo()
    
    if (!user) {
      throw new Error('사용자 인증에 실패했습니다.')
    }

    // 게시물 정보 가져오기
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author, content')
      .eq('id', postId)
      .single()

    if (fetchError) throw fetchError

    // 작성자 확인
    if (post.author !== user.nickname) {
      throw new Error('삭제 권한이 없습니다.')
    }

    // 게시물에서 이미지 URL 추출
    const imageUrls = extractImageUrls(post.content);

    // 이미지 삭제
    await Promise.all(imageUrls.map(async (url) => {
      const path = new URL(url).pathname.split('/').pop();
      if (path) {
        const { error } = await supabase.storage
          .from('posts')
          .remove([path]);
        if (error) console.error('Error deleting image:', error);
      }
    }));

    // 게시물 삭제
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (deleteError) throw deleteError
    
  } catch (error) {
    console.error('Error deleting post:', error)
    return { errorMsg: (error as Error).message }
  }

  revalidatePath(`/posts/lists/${categorySlug}`, 'layout')
  redirect(`/posts/lists/${categorySlug}`)
}



export async function getCategoryDetails(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category details:', error)
    return null
  }

  return data
}



export async function incrementViewCount(postId: string): Promise<{ views: number }> {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('increment_view_count', { post_id: postId })

  if (error) {
    console.error('Error incrementing view count:', error)
    throw new Error(`Failed to increment view count: ${error.message}`)
  }
  console.log('Data returned from increment_view_count:', data)
  if (!data) {
    throw new Error('No data returned from increment_view_count')
  }

  return { views: data.views }
}

export async function toggleRecommendation(postId: number) {
  const supabase = createClient();
  const user = await getUserInfo();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  console.log('Checking existing recommendation...');
  const { data: existingRecommendation, error: checkError } = await supabase
    .from('post_recommendations')
    .select()
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('추천 확인 중 오류 발생:', checkError);
    throw new Error('추천 확인 중 오류가 발생했습니다.');
  }

  let result;
  if (existingRecommendation) {
    result = await supabase.rpc('decrement_recommendation', {
      p_post_id: postId,
      p_user_id: user.id  
    });
  } else {
    result = await supabase.rpc('increment_recommendation', {
      p_post_id: postId,  
      p_user_id: user.id  
    });
  }

  const { data, error } = result;

  if (error) {
    console.error('추천 처리 중 오류 발생:', error);
    throw new Error('추천 처리 중 오류가 발생했습니다.');
  }

  const isRecommended = await checkUserRecommendation(postId, user.id);

  revalidatePath(`/posts/view/[slug]/[id]`);
  return { recommendations: data.recommendations, isRecommended };
}



export async function checkUserRecommendation(postId: number, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_recommendations')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('추천 확인 중 오류 발생:', error)
    return false;  // 에러 발생 시 기본적으로 false 반환
  }

  return !!data
}