import UserProfile from '../userProfile/UserProfile';
import LoginForm from '../loginForm/LoginForm';
import styles from './AuthSection.module.scss';
import { createClient } from '@/lib/supabase/supabaseServer';
import Link from 'next/link';
import Text from '@/components/text/Text';
const AuthSection = async () => {
  const supabase = createClient()

  const { data, } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthenticated = data?.user

  return (
    <div className={styles.section}>
      {isAuthenticated ? (
          <UserProfile/>
      ) : (
        <>
          <LoginForm />
          <div className={styles.auth__link}>
            <Link href='/auth/findAuth'>
              <Text variant='p' color='gray' fontSize='xs' underline>아이디/비밀번호 찾기</Text>
            </Link>
            <Link href='/auth/signUp'>
              <Text variant='p' color='gray' fontSize='xs' underline>회원가입</Text>
            </Link>
        </div>
        </>

      )}
    </div>
  );
};

export default AuthSection;