import React from 'react';
import LoginForm from '@/components/auth/loginForm/LoginForm';
import { Content, ContentWrap } from '@/components/common/content';
import Text from '@/components/text/Text';
const Login = () => {
  return (
    <ContentWrap>
      <Content title="로그인"  maxWidth='420px'>
        <LoginForm />
        <div style={{marginTop: 12}}>
          <Text variant='p' color='red' fontSize='sm'>로그인 해야 이용 가능 합니다.</Text>
        </div>
      </Content>
    </ContentWrap>
  );
}

export default Login;