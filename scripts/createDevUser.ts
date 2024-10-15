import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { User } from '@supabase/supabase-js';

interface SupabaseAuthError extends Error {
  status?: number;
}

async function createOrVerifyDefaultUser(): Promise<User | null> {
  const defaultEmail = 'minz@minz.com';
  const defaultPassword = 'minz123';
  const defaultName = 'Dev Minz';
  const defaultNickname = 'Minz';

  try {
    // 이메일로 사용자 조회
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();

    if (getUserError) throw getUserError;

    const existingUser = users?.users?.find(user => user.email === defaultEmail);
    if (existingUser) {
      console.log('이미 있는 이메일 :', existingUser.email);
      return existingUser;
    }

    // 사용자가 없으면 생성
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: defaultEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: { name: defaultName, nickname: defaultNickname },
    });

    if (createError) throw createError;

    if (!newUser) {
      throw new Error('생성 실패');
    }

    // userinfo 테이블에 데이터 삽입
    const { error: insertError } = await supabaseAdmin
      .from('userinfo')
      .upsert({
        id: newUser.user.id,
        email: newUser.user.email,
        name: defaultName,
        nickname: defaultNickname,
      });

    if (insertError) {
      console.error('userinfo 테이블 삽입 실패:', insertError);
      throw insertError;
    }

    console.log('생성 성공 :', newUser.user?.email);
    return newUser.user;

  } catch (error) {
    const supabaseError = error as SupabaseAuthError;
    console.error('에러 이유:', supabaseError);
    throw error;
  }
}

createOrVerifyDefaultUser();