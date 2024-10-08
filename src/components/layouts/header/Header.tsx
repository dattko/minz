import Link from 'next/link';
import styles from './Header.module.scss';
import HeaderSearch from './HeaderSerach';
import Text from '@/components/text/Text';
import { MenuItem } from '@/types/menu';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';


const Header = async () => {
  const menuItems = await fetchMenuItems();
  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__wrap}>
          <div className={styles.header__logo}>
            <Link href="/">Minz</Link>
          </div>
          <HeaderSearch />
        </div>
      </header>
      <nav className={styles.nav}>
        <div className={styles.nav__wrap}>
          <ul className={styles.nav__ul}>
            {menuItems.map((item: MenuItem) => (
              <li key={item.id} className={styles.nav__li}>
                <Link href={item.link}>
                  <Text variant='p' color='white'>{item.title}</Text>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

const fetchMenuItems = async (): Promise<MenuItem[]> => {

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/menu_items`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    const data = await response.json();
    return data as MenuItem[];
  } catch (error) {
    console.error("메뉴 불러오기 실패 :", error);
    return [];
  }
}

export default Header;