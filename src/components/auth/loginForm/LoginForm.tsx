'use client'
import React, { useEffect, useState } from 'react';
import Btn from '@/components/common/button/Btn';
import { Input, CheckBox, InputWrap } from '@/components/common/input';
import styles from './LoginForm.module.scss';
import { login } from '../authSection/action';
import { createClient } from '@/lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('로그인 감지됨');
        router.refresh();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (formData: FormData) => {
    if (rememberMe) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    // 서버 액션 호출
    await login(formData);
  };

  return (
    <form className={styles.loginForm} action={handleSubmit}>
      <InputWrap>
        <Input
          id="email" 
          name="email" 
          type="email" 
          required 
          placeholder='이메일(아이디)'
          value={email}
          onChange={handleEmailChange}
          autoComplete='email'
        />
      </InputWrap>
      <InputWrap>
        <Input
          id="password" 
          name="password" 
          type="password" 
          required
          placeholder='비밀번호'
          autoComplete='current-password'
        />
      </InputWrap>
      <div className={styles.login__option}>
        <CheckBox 
          id='saveid' 
          name='saveid' 
          label='아이디 저장'
          checked={rememberMe}
          onChange={handleRememberMeChange}
        />
        <Btn size='small' type="submit">로그인</Btn>
      </div>
    </form>
  );
};

export default LoginForm;