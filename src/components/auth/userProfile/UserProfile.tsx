import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import Btn from '@/components/common/button/Btn';


const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();


  return (
    <div >
        {user?.email}
        <Btn onClick={logout}>로그아웃</Btn>
    </div>
  );
}

export default UserProfile;