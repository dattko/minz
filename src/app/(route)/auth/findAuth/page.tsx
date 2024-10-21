'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/supabaseClient';
import { Input, InputWrap } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import { Content, ContentWrap } from '@/components/common/content';
import Tab, { useTabStore } from '@/components/common/tab/Tab';

const FindAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { activeTab } = useTabStore();

  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (error) {
      setMessage('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Password reset error:', error);
    }
  };

  const handleAccountSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // 여기서 실제로는 서버에 요청을 보내 계정을 찾아야 합니다.
    // 이 예제에서는 단순히 메시지만 표시합니다.
    setMessage('입력하신 정보로 계정을 찾고 있습니다. 결과는 등록된 이메일로 전송됩니다.');
  };

  const tabs = [
    { id: 'accountSearch', label: '계정 찾기' },
    { id: 'passwordReset', label: '비밀번호 재설정' },
  ];

  return (
    <ContentWrap className="find-auth-container" column>
      <Tab tabs={tabs} />
      <Content title={activeTab === 'accountSearch' ? '계정 찾기' : '비밀번호 재설정'} maxWidth='600px'>
        {activeTab === 'accountSearch' ? (
          <form onSubmit={handleAccountSearch}>
            <InputWrap>
              <Input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputWrap>
            <Btn type="submit">계정 찾기</Btn>
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
            <Btn type="submit">비밀번호 재설정 링크 받기</Btn>
          </form>
        )}

        {message && <p className="message">{message}</p>}
      </Content>
    </ContentWrap>
  );
};

export default FindAuth;