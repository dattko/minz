'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/supabaseClient';
import { User } from '@/types/dataType';
import { ContentWrap, Content } from '@/components/common/content';
import { InputWrap, Input } from '@/components/common/input';
import Btn from '@/components/common/button/Btn';
import Text from '@/components/text/Text';
import styles from './MyPageSettings.module.scss';
import { updateProfile, changePassword } from '@/components/auth/authSection/action';
import { getUserInfo } from '@/components/auth/authSection/action';

const SettingsForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('userinfo')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUser(data);
          setNickname(data.nickname || '');
        }
      }
    };

    fetchUser();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setMessage('');
    setError('');

    const result = await updateProfile(user.id, nickname);

    if (result.success) {
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
    } else {
      setError(result.error || '프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await changePassword(user.id, currentPassword, newPassword);

    if (result.success) {
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <ContentWrap>
      <Content title='프로필 변경' maxWidth='600px'>
        <form onSubmit={handleProfileUpdate}>
          <InputWrap>
            <Input
              type="email"
              placeholder="이메일"
              value={user?.email || ''}
              readOnly
            />
          </InputWrap>
          <InputWrap>
            <Input
              type="text"
              placeholder="이름"
              value={user?.name || ''}
              readOnly
            />
          </InputWrap>
          <InputWrap>
            <Input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </InputWrap>
          <Btn type="submit">프로필 업데이트</Btn>
        </form>
      </Content>

      <Content className={styles.settings__section} title='비밀번호 변경' maxWidth='600px'>
        <form onSubmit={handlePasswordChange}>
          <InputWrap>
            <Input
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </InputWrap>
          <InputWrap>
            <Input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </InputWrap>
          <InputWrap>
            <Input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputWrap>
          <Btn type="submit">비밀번호 변경</Btn>
        </form>
      </Content>

      {message && <Text variant="p" className={styles.settings__message}>{message}</Text>}
      {error && <Text variant="p" className={styles.settings__error}>{error}</Text>}
    </ContentWrap>
  );
};

export default SettingsForm;