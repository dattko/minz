'use server'

import { createClient } from '@/lib/supabase/supabaseServer'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];


export async function uploadImage(fileData: { name: string; type: string; size: number; base64: string }) {
  const supabase = createClient()

  // 파일 크기 검증
  if (fileData.size > MAX_FILE_SIZE) {
    throw new Error('이미지 용량이 10메가를 초과했습니다.');
  }

  // 파일 타입 검증
  if (!ALLOWED_FILE_TYPES.includes(fileData.type)) {
    throw new Error('jpg, png, gif, webp 형식의 이미지만 업로드 가능합니다.');
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const fileExt = fileData.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${fileName}`

  // Base64 문자열에서 실제 파일 데이터 부분만 추출
  const base64Data = fileData.base64.split(',')[1]

  // Base64를 Buffer로 변환
  const buffer = Buffer.from(base64Data, 'base64')

  const { data, error: uploadError } = await supabase.storage
    .from('posts')
    .upload(filePath, buffer, {
      contentType: fileData.type,
      upsert: false
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error(uploadError.message || 'Failed to upload image')
  }

  if (!data) {
    throw new Error('No data returned from upload')
  }

  const { data: urlData } = supabase.storage
    .from('posts')
    .getPublicUrl(filePath)

  if (!urlData || !urlData.publicUrl) {
    throw new Error('Failed to get public URL')
  }

  return urlData.publicUrl
}


export async function deleteImage(imageUrl: string) {
  const supabase = createClient()

  const path = imageUrl.split('/').pop();
  if (!path) {
    throw new Error('Invalid image URL');
  }

  const { error } = await supabase.storage
    .from('posts')
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}