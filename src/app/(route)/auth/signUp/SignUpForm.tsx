'use client';
import React from 'react';
import { useFormState } from "react-dom";
import Text from '@/components/text/Text';
import { Input, InputWrap } from '@/components/common/input';
import { ContentWrap, Content } from '@/components/common/content';
import Btn from '@/components/common/button/Btn';
import { signup } from '@/components/auth/authSection/action';

const initialState = {
  errorMsg: {},
};

const SignUpForm = ()=> {
  const [state, formAction] = useFormState(signup, initialState);

  return (
    <ContentWrap>
      <Content title='회원가입' maxWidth='600px'>
        <form action={formAction}>
          <InputWrap label='이메일'>
            <Input 
              name="email"
              type="email"
              required
            />
          </InputWrap>
          <InputWrap label='비밀번호'>
            <Input 
              name="password"
              type="password"
              required
            />
          </InputWrap>
          <div className='form__row'>
            <InputWrap label='이름'>
              <Input 
                name="name"
                required
              />
            </InputWrap>
            <InputWrap label='닉네임'>
              <Input
                name="nickname"
                required
              />
            </InputWrap>
          </div>
          {state.errorMsg &&
            Object.values(state.errorMsg).map((error, index) => (
              <Text key={index} variant='p' color='red'>{error}</Text>
            ))
          } 
          <Btn type='submit'>회원가입</Btn>
        </form>
      </Content>
    </ContentWrap>
  );
}

export default SignUpForm;
