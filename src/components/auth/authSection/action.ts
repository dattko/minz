'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/supabaseServer'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    redirect('/error')
  }
  console.log('로그인 성공')
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('로그아웃 실패:', error.message)
    return { success: false, error: error.message }
  }
  
  console.log('로그아웃 성공')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}