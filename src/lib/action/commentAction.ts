'use server'
import { revalidatePath } from 'next/cache'
import { Comment } from '@/types/dataType'
import { getUserInfo } from '@/components/auth/authSection/action'
import { fetchSupabaseData } from '../supabase/api'
import { supabaseUrl, supabaseKey } from '../supabase/supabase'

export async function fetchComments(postId: number): Promise<Comment[]> {
  const data = await fetchSupabaseData(`comments?select=*&post_id=eq.${postId}&order=created_at.asc`);
  return data || [];
}

export async function addComment(postId: number, content: string): Promise<void> {
  const user = await getUserInfo()
  if (!user) throw new Error('로그인 해주세요.')

  const response = await fetch(`${supabaseUrl}/rest/v1/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ 
      post_id: postId,
      content,
      author: user.nickname,
      author_id: user.id,
      parent_id: null
    }),
  });

  if (!response.ok) {
    throw new Error(`대글 추가 실패 : ${response.status}`);
  }

  revalidatePath(`/posts/${postId}`);
}

export async function addReply(postId: number, parentId: number, content: string): Promise<void> {
  const user = await getUserInfo()
  if (!user) throw new Error('로그인 해주세요.')

  const response = await fetch(`${supabaseUrl}/rest/v1/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ 
      post_id: postId,
      content,
      author: user.nickname,
      author_id: user.id,
      parent_id: parentId
    }),
  });

  if (!response.ok) {
    throw new Error(`답글 달기 실패: ${response.status}`);
  }

  revalidatePath(`/posts/${postId}`);
}

export async function editComment(commentId: number, content: string): Promise<void> {

  const response = await fetch(`${supabaseUrl}/rest/v1/comments?id=eq.${commentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ 
      content, 
      updated_at: new Date().toISOString() 
    }),
  });

  if (!response.ok) {
    throw new Error(`댓글 수정 실패: ${response.status}`);
  }

  revalidatePath('/posts/[id]', 'layout');
}

export async function deleteComment(commentId: number): Promise<void> {

  const response = await fetch(`${supabaseUrl}/rest/v1/comments?id=eq.${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
  });

  if (!response.ok) {
    throw new Error(`댓글 삭제 실패: ${response.status}`);
  }

  revalidatePath('/posts/[id]', 'layout');
}