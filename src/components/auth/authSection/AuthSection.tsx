import UserProfile from '../userProfile/UserProfile';
import LoginForm from '../loginForm/LoginForm';
import styles from './AuthSection.module.scss';
import { createClient } from '@/lib/supabase/supabaseServer';

const AuthSection = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  const isAuthenticated = data?.user

  return (
    <div className={styles.section}>
      {isAuthenticated ? (
        <UserProfile/>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default AuthSection;