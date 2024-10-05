import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Btn from '@/components/common/button/Btn';
import Text from '@/components/text/Text';
import { Input, CheckBox } from '@/components/common/input';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }
      console.log('로그인 성공');
    } catch (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('로그인 에러 발생');
    }
  };

  const rememberId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem('savedEmail');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <Input
        type='email'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
        placeholder='이메일(아이디)'
      />
      <Input
        type='password'
        name='password'
        required
        placeholder='비밀번호'
      />
      <div className={styles.login__option}>
        <CheckBox 
          label='아이디 저장' 
          checked={rememberMe}
          onChange={rememberId}
        />
        <Btn variant='primary'>로그인</Btn>
      </div>
      {error && <Text variant='p' className={styles.errorMessage}>{error}</Text>}
    </form>
  );
};

export default LoginForm;