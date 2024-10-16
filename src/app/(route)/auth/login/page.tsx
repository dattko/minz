import React from 'react';
import LoginForm from '@/components/auth/loginForm/LoginForm';
import { Content, ContentWrap } from '@/components/common/content';
import Text from '@/components/text/Text';
import styles from './Login.module.scss';
import { getUserInfo } from '@/components/auth/authSection/action';
import { redirect } from 'next/navigation';

const Login = async () => {
    const user = await getUserInfo();

    if (user) {
      redirect('/');
    }

  return (
    <div className={styles.login}>
      <div className={styles.login__wrap}>
        <ContentWrap>
          <Content title="로그인"  maxWidth='420px'>
            <LoginForm />
          </Content>
        </ContentWrap>
      </div>
      <div className={styles.login__text}>
        <Text variant='p' color='red' fontSize='sm'>로그인 해야 이용 가능 합니다.</Text>
      </div>
    </div>
  );
}

export default Login;
