'use client'
import { logout } from '../authSection/action'
import Btn from '@/components/common/button/Btn'

const LogoutBtn = () => {
  const handleLogout = async () => {
    await logout();
  };

  return <Btn size='small' onClick={handleLogout}>로그아웃</Btn>
}

export default LogoutBtn