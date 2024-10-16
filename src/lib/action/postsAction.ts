'use server'
import { createClient } from '@/lib/supabase/supabaseServer'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { EditPost } from '@/types/dataType'
import { getUserInfo } from '@/components/auth/authSection/action'

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

    const { data, error } = await supabase
      .from('posts')
      .insert({ 
        title,
        content: finalContent,
        author: user.nickname,
        category_slug, 
        status: 'published'
      })

    if (error) throw error


  } catch (error) {
    console.error('Error creating post:', error)
    return { errorMsg: (error as Error).message }
  }
  revalidatePath('/posts')
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
  
  revalidatePath('/posts')
  redirect(`/posts/${id}`)
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

  revalidatePath('/posts')
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

export async function incrementViewCount(postId: string) {
  const supabase = createClient()
  
  // 먼저 현재 조회수를 가져옵니다
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('views')
    .eq('id', postId)
    .single()

  if (fetchError) {
    console.error('Error fetching current view count:', fetchError)
    throw new Error('Failed to fetch current view count')
  }

  const currentViews = currentPost?.views || 0
  const newViews = currentViews + 1

  // 그 다음 조회수를 업데이트합니다
  const { data, error } = await supabase
    .from('posts')
    .update({ views: newViews })
    .eq('id', postId)
    .select()

  if (error) {
    console.error('Error incrementing view count:', error)
    throw new Error('Failed to increment view count')
  }

  revalidatePath(`/posts/[slug]/[id]`)
  return data[0]
}