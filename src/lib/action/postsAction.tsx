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