import React from 'react';
import { createClient } from '@/lib/supabase/supabaseServer';
import LogoutBtn from './LogoutBtn';
import styles from './UserProfile.module.scss';
import Text from '@/components/text/Text';
import Btn from '@/components/common/button/Btn';
import { Settings } from 'lucide-react';
import { fetchSupabaseData } from '@/lib/supabase/api';
import { userProps } from '@/types/dataType';



const UserProfile: React.FC = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  try {
    const users:userProps[] = await fetchSupabaseData(`userinfo?id=eq.${data.user?.id}`);
    const user = users[0];

    if (!user) {
      return <Text variant='p'>사용자 정보를 찾을 수 없습니다.</Text>;
    }

    return (
      <div className={styles.userProfile}>
        <div className={styles.userInfo}>
          <Btn size='icon' variant='outline-secondary' className={styles.editProfile}>
            <Settings/>
          </Btn>
          <Text variant='p' className={styles.username}>{user.email}</Text>
          <Text variant='p' className={styles.level}>Lv: {user.user_level}</Text>
          <Text variant='p' className={styles.points}>포인트: {user.point}</Text>
          <Text variant='p' className={styles.write}>게시글: {user.post_count}</Text>
        </div>
        <div className={styles.actions}>
          <LogoutBtn/>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user info:', error);
    return <Text variant='p'>사용자 정보를 불러오는 중 오류가 발생했습니다.</Text>;
  }
}

export default UserProfile;