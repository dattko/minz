'use server'
import { createClient } from '@/lib/supabase/supabaseServer'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreatePosts } from '@/types/dataType'
import { getUserInfo } from '@/components/auth/authSection/action'

export async function createPosts(postData: CreatePosts) {
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

// HTML 컨텐츠에서 이미지 URL을 추출하는 헬퍼 함수
function extractImageUrls(content: string): string[] {
  const regex = /<img[^>]+src="?([^"\s]+)"?\s*/gi;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(content))) {
    urls.push(match[1]);
  }
  return urls;
}
