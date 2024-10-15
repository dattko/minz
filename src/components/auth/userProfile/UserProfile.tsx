import React from 'react';
import LogoutBtn from './LogoutBtn';
import styles from './UserProfile.module.scss';
import Text from '@/components/text/Text';
import Btn from '@/components/common/button/Btn';
import { Settings } from 'lucide-react';
import { getUserInfo } from '../authSection/action';

const UserProfile: React.FC = async () => {
  const user = await getUserInfo();

  if (!user) {
    return <Text variant='p'>사용자 정보를 불러올 수 없습니다.</Text>;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <Btn size='icon' variant='outline-secondary' className={styles.editProfile}>
          <Settings/>
        </Btn>
        <Text variant='p' className={styles.username}>{user.nickname}</Text>
        <Text variant='p' className={styles.level}>Lv: {user.user_level}</Text>
        <Text variant='p' className={styles.points}>포인트: {user.point}</Text>
        <Text variant='p' className={styles.write}>게시글: {user.post_count}</Text>
      </div>
      <div className={styles.actions}>
        <LogoutBtn/>
      </div>
    </div>
  );
};

export default UserProfile;
