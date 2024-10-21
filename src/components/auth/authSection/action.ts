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
  unexpectedError: '예상치 못한 오류가 발생했습니다. 나중에 다시 시도해주세요.',
  nicknameTaken: '이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.'
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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const nickname = formData.get('nickname') as string;
  const supabase = createClient();
  const errorMsg: State['errorMsg'] = {};

  try {
    const { data: existingUsers, error: nicknameCheckError } = await supabase
      .from('userinfo')  // 'profiles' 테이블을 사용합니다. 실제 테이블 이름에 맞게 수정해주세요.
      .select('id')
      .ilike('nickname', nickname)
      .limit(1);

    if (nicknameCheckError) {
      console.error('닉네임 중복 확인 중 오류:', nicknameCheckError);
      return { errorMsg: { nickname: ERROR_MESSAGE.unexpectedError } };
    }

    if (existingUsers && existingUsers.length > 0) {
      return { errorMsg: { nickname: ERROR_MESSAGE.nicknameTaken } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          nickname,
        },
      },
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        errorMsg.email = ERROR_MESSAGE.emailAlreadyExists;
      } else if (error.message.includes('invalid email')) {
        errorMsg.email = ERROR_MESSAGE.invalidEmail;
      } else if (error.message.includes('password is too weak')) {
        errorMsg.password = ERROR_MESSAGE.weakPassword;
      } else if (password.length < 6) {
        errorMsg.password = '비밀번호는 최소 6자 이상이어야 합니다.';
      } else {
        console.error('인증 오류:', error);
        return { errorMsg: { email: ERROR_MESSAGE.unexpectedError } };
      }
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


export async function resetPassword(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function findAccount(name: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('userinfo')
      .select('email')
      .ilike('nickname', name)

    if (error) throw error;

    if (data && data.length > 0) {
      // 모든 일치하는 이메일 주소를 마스킹 처리
      const maskedEmails = data.map(item => 
        item.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      );
      
      return { 
        success: true, 
        message: `${maskedEmails.length}개의 계정을 찾았습니다.`,
        emails: maskedEmails 
      };
    } else {
      return { success: false, message: '해당 이름으로 등록된 계정을 찾을 수 없습니다.' };
    }
  } catch (error) {
    console.error('Account search error:', error);
    return { success: false, message: '계정 검색 중 오류가 발생했습니다.' };
  }
}



export async function updateProfile(userId: string, newNickname: string) {
  const supabase = createClient();
  
  const { data: existingUser, error: checkError } = await supabase
    .from('userinfo')
    .select('id')
    .eq('nickname', newNickname)
    .neq('id', userId)  // 자기 자신은 제외
    .single();

  if (checkError && checkError.code !== 'PGRST116') {  
    console.error('Nickname check error:', checkError);
    return { success: false, error: '닉네임 확인 중 오류가 발생했습니다.' };
  }

  if (existingUser) {
    return { success: false, error: '이미 사용 중인 닉네임입니다.' };
  }

  // 닉네임 업데이트
  const { error: updateError } = await supabase
    .from('userinfo')
    .update({ nickname: newNickname })
    .eq('id', userId);

  if (updateError) {
    console.error('Profile update error:', updateError);
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const supabase = createClient();

  // 현재 비밀번호 확인
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userId, // 이메일 대신 userId를 사용
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: '현재 비밀번호가 올바르지 않습니다.' };
  }

  // 새 비밀번호로 업데이트
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error('Password change error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}