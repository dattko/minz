import React from 'react';
import SettingsForm from './SettingsForm';
import { getUserInfo } from '@/components/auth/authSection/action';
import { redirect } from 'next/navigation';


const MyPageSettings = async () => {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <SettingsForm />
  );
}

export default MyPageSettings;