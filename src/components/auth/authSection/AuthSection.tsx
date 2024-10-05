'use client';
import React from 'react';
import LoginForm from '@/components/auth/loginForm/LoginForm';
import UserProfile from '@/components/auth/userProfile/UserProfile';
import styles from './AuthSection.module.scss';
import { useAuth } from '@/contexts/auth/AuthContext';

const AuthSection: React.FC = () => {
  const { user } = useAuth();



  return (
    <div className={styles.authSection}>
      {user ? <UserProfile /> : <LoginForm />}
    </div>
  );
};

export default AuthSection;