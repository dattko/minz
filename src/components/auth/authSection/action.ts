'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/supabaseServer'
import { fetchSupabaseData } from '@/lib/supabase/api'
import { User } from '@/types/dataType';

type State = {
  errorMsg?: {
    email?: string;
    password?: string;
    name?: string;
    nickname?: string;
  };
};

type UserType = 'nomal' | 'admin'; 

const ERROR_MESSAGE = {
  emailAlreadyExists: '이 이메일은 이미 등록되어 있습니다. 로그인 해주세요.',
  invalidEmail: '유효한 이메일 주소를 입력해주세요.',
  weakPassword: '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 선택해주세요.',
  unexpectedError: '예상치 못한 오류가 발생했습니다. 나중에 다시 시도해주세요.'
};

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
  redirect('/')
}


export async function signup(prevState: State, formData: FormData): Promise<State> {
  const userType = formData.get("userType") as UserType;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const nickname = formData.get('nickname') as string;
  const supabase = createClient();
  const errorMsg: State['errorMsg'] = {};


  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          nickname,
        },
      },
    });

    // 서버 에러 처리
    if (error) {
      if (error.message.includes('User already registered')) {
        errorMsg.email = ERROR_MESSAGE.emailAlreadyExists;
      } else if (error.message.includes('invalid email')) {
        errorMsg.email = ERROR_MESSAGE.invalidEmail;
      } else if (error.message.includes('password is too weak')) {errorMsg.password = ERROR_MESSAGE.weakPassword;
      }else if (password.length < 6) {
        errorMsg.password = '비밀번호는 최소 6자 이상이어야 합니다.';
      } else {
        console.error('인증 오류:', error);
        return { errorMsg: { email: ERROR_MESSAGE.unexpectedError } };
      }
    }

    if (Object.keys(errorMsg).length > 0) {
      return { errorMsg };
    }

  } catch (error) {
    console.error('가입 중 예상치 못한 오류 발생:', error);
    return { errorMsg: { email: ERROR_MESSAGE.unexpectedError } };
  }

  console.log('회원가입 성공');
  revalidatePath('/', 'layout');
  return redirect('/');
}



export const getUserInfo = async (): Promise<User | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    console.error('Error fetching user:', error);
    return null;
  }

  try {
    const users: User[] = await fetchSupabaseData(`userinfo?id=eq.${data.user?.id}`);
    return users[0] || null;
  } catch (fetchError) {
    console.error('Error fetching user info:', fetchError);
    return null;
  }
};
