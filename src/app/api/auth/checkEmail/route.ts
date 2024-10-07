import { NextResponse } from 'next/server';
import { checkEmailExists } from '@/components/auth/authSection/action';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 });
  }

  const { exists, error } = await checkEmailExists(email);

  if (error) {
    return NextResponse.json({ error: '이메일 확인 중 오류가 발생했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ exists });
}

