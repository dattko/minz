import React from 'react';
import LogoutBtn from './LogoutBtn';
import styles from './UserProfile.module.scss';
import Text from '@/components/text/Text';
import Btn from '@/components/common/button/Btn';
import { Settings } from 'lucide-react';
import { getUserInfo } from '../authSection/action';
import Link from 'next/link';

const UserProfile: React.FC = async () => {
  const user = await getUserInfo();


  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <Link href={'/mypage/settings'}>
          <Btn size='icon' variant='outline-secondary' className={styles.editProfile}>
            <Settings/>
          </Btn>
        </Link>
        <Text variant='p' className={styles.username}>{user?.nickname}</Text>
        <Text variant='p' className={styles.level}>Lv: {user?.user_level}</Text>
        <Text variant='p' className={styles.points}>포인트: {user?.point}</Text>
        <Link href="/mypage/posts">
         <Text variant='p' className={styles.write}>게시글: {user?.post_count}</Text>
        </Link>
      </div>
      <div className={styles.actions}>
        <LogoutBtn/>
      </div>
    </div>
  );
};

export default UserProfile;
