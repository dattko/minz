import React from 'react';
import { createClient } from '@/lib/supabase/supabaseServer';
import LogoutBtn from './LogoutBtn';
import styles from './UserProfile.module.scss';
import Text from '@/components/text/Text';
import Btn from '@/components/common/button/Btn';
import { Settings } from 'lucide-react';

const UserProfile = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const userLevel = 5;
  const userPoints = 1250;
  const userWirteCount = 100;


  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <Btn size='icon' variant='outline-secondary'  className={styles.editProfile}><Settings/></Btn>
        <Text variant='p' className={styles.username}>{data?.user?.email}</Text>
        <Text variant='p' className={styles.level}>레벨: {userLevel}</Text>
        <Text variant='p' className={styles.points}>포인트: {userPoints}</Text>
        <Text variant='p' className={styles.wirte}>게시글 : {userWirteCount}</Text>
      </div>
        <div className={styles.actions}>
          <LogoutBtn />

        </div>
    </div>
  );
}

export default UserProfile;