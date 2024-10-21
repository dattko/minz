'use client';
import React, { useState, useEffect } from 'react';
import { Input, InputWrap } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import { Content, ContentWrap } from '@/components/common/content';
import Tab, { useTabStore } from '@/components/common/tab/Tab';
import { resetPassword, findAccount } from '@/components/auth/authSection/action';
import Text from '@/components/text/Text';
import styles from './FindAuth.module.scss';

const FindAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { activeTab } = useTabStore();

  // 탭이 변경될 때마다 폼 리셋
  useEffect(() => {
    setEmail('');
    setName('');
    setMessage('');
  }, [activeTab]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
      } else {
        setMessage(result.error || '오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Password reset error:', error);
    }
  };

  const handleAccountSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
  
    try {
      const result = await findAccount(name);
      if (result.success) {
        setMessage(`${result.message} 관련 이메일: ${result.emails?.join(', ')}`);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Account search error:', error);
    }
  };

  const tabs = [
    { id: 'accountSearch', label: '계정 찾기' },
    { id: 'passwordReset', label: '비밀번호 재설정' },
  ];

  return (
    <ContentWrap column>
      <Tab tabs={tabs} />
      <Content title={activeTab === 'accountSearch' ? '계정 찾기' : '비밀번호 재설정'} maxWidth='600px'>
        {activeTab === 'accountSearch' ? (
          <form onSubmit={handleAccountSearch}>
            <InputWrap>
              <Input
                type="text"
                placeholder="닉네임"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputWrap>
            <div className={styles.form__result}>
              {message && <Text variant='p'>{message}</Text>}
              <Btn type="submit">계정 찾기</Btn>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <InputWrap>
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrap>
            <div className={styles.form__result}>
              {message && <Text variant='p'>{message}</Text>}
              <Btn type="submit">비밀번호 재설정 링크 받기</Btn>
            </div>
          </form>
        )}
      </Content>
    </ContentWrap>
  );
};

export default FindAuth;