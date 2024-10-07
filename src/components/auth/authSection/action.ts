'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/supabaseServer'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'

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


export async function signup(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    cellphone: formData.get('cellphone') as string,
  };

  // 트랜잭션 시작
  const { data: signUpData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const user = signUpData.user;

  if (user) {
    // profiles 테이블에 사용자 정보 upsert
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        name: data.name,
        cellphone: data.cellphone,
      }, {
        onConflict: 'id', // 'id' 컬럼에 충돌이 있을 경우 업데이트
      });

    if (profileError) {
      // 프로필 생성 실패 시 사용자 삭제 (롤백)
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { success: false, error: profileError.message };
    }
  } else {
    return { success: false, error: "User creation failed" };
  }

  return { success: true };
}



export async function checkEmailExists(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('이메일 확인 중 오류 발생:', error.message);
    return { exists: false, error: error.message };
  }

  const exists = data?.users?.some((user) => user.email === email);
  return { exists, error: null };
}
