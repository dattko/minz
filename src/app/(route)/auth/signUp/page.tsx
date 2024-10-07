'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Text from '@/components/text/Text';
import { Input, InputWrap } from '@/components/common/input';
import styles from './SignUpPage.module.scss';
import { ContentWrap, Content } from '@/components/common/content';
import Btn from '@/components/common/button/Btn';
import { signup, checkEmailExists } from '@/components/auth/authSection/action';

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [error, setError] = useState('');
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
  
    if (!email || !password || !name || !cellphone) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('cellphone', cellphone);
  
    try {
      const response = await signup(formData);
      if (response.success) {
        router.push('/');
      } else {
        setError(response.error || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleEmailCheck = async () => {
    if (!email) {
      setEmailCheckMessage('이메일을 입력해주세요.');
      return;
    }
    setIsCheckingEmail(true);
    setEmailCheckMessage('');
  
    try {
      const response = await fetch('/api/auth/checkEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
  
      if (result.exists) {
        setEmailCheckMessage('이미 사용 중인 이메일입니다.');
      } else {
        setEmailCheckMessage('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      setEmailCheckMessage('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <ContentWrap >
      <Content title='회원가입' maxWidth='600px'>
        <form onSubmit={handleSubmit}>
          <InputWrap label='이메일'>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              btnTitle='중복확인'
              btnClick={handleEmailCheck}
              disabled={isCheckingEmail}
            />
            {emailCheckMessage && <Text variant='p' color={emailCheckMessage.includes('사용 가능') ? 'green' : 'red'}>{emailCheckMessage}</Text>}
          </InputWrap>
          <InputWrap label='비밀번호'>
            <Input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrap>
          <div className='form__row'>
            <InputWrap label='이름'>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </InputWrap>
            <InputWrap label='휴대번호'>
              <Input
                value={cellphone} 
                onChange={(e) => setCellphone(e.target.value)}
              />
            </InputWrap>
          </div>
          {error && <Text variant='p' color='red'>{error}</Text>}
          <Btn type="submit">회원가입</Btn>
        </form>
      </Content>
    </ContentWrap>
  );
}

export default SignUpPage;