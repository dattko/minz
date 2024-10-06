import React from 'react';
import Btn from '@/components/common/button/Btn';
// import { logout } from '../authSection/action';
import { createClient } from '@/lib/supabase/supabaseServer';
import LogoutBtn from './LogoutBtn';


const UserProfile = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()



  return (
    <div >
        {data?.user?.email}
        <LogoutBtn/>
    </div>
  );
}

export default UserProfile;
