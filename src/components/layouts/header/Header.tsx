import Link from 'next/link';
import styles from './Header.module.scss';
import HeaderSearch from './HeaderSerach';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';
import { MenuItem } from '@/types/dataType';
import Nav from './Nav';
import HeaderMenuBtn from './HeaderMenuBtn';
import { HeaderProvider, useHeader } from '@/contexts/header/HeaderContext';
import AuthSection from '@/components/auth/authSection/AuthSection';


const Header = async () => {
  const menuItems = await fetchMenuItems();


  return (
    <HeaderProvider>
      <header className={styles.header}>
        <div className={styles.header__wrap}>
          <div className={styles.header__logo}>
            <Link href="/">Minz</Link>
          </div>
          <HeaderSearch />
          <HeaderMenuBtn/>
        </div>
      </header>
      <Nav menuItems={menuItems} >
        <AuthSection />
      </Nav>
    </HeaderProvider>
  );
};

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/menu_items?select=*,categories(slug)&is_visible=eq.true&order=display_order.asc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      category_slug: item.categories?.slug
    }));
  } catch (error) {
    console.error("메뉴 불러오기 실패 :", error);
    return [];
  }
}



export default Header;

