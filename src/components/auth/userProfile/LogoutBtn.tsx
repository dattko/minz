'use client'
import { useRouter } from 'next/navigation'
import { logout } from '../authSection/action'
import { createClient } from '@/lib/supabase/supabaseClient'
import Btn from '@/components/common/button/Btn'

const LogoutBtn = () => {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      const result = await logout()

      if (result.success) {

        router.push('/')
        router.refresh() 
      } else {
        console.error('로그아웃 실패:', result.error)
      }
    } catch (error) {
      console.error('로그아웃 에러:', error)
    }
  }

  return <Btn size='small' onClick={handleLogout}>로그아웃</Btn>
}

export default LogoutBtn