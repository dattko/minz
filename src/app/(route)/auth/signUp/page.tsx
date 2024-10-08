import { createClient } from '@/lib/supabase/supabaseServer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignUpForm from './SignUpForm'; // 클라이언트 컴포넌트

export default async function SignUpPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return <SignUpForm />;
}