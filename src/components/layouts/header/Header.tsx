// Header.tsx
import Link from 'next/link';
import styles from './Header.module.scss';
import HeaderSearch from './HeaderSerach';
import Text from '@/components/text/Text';
import { supabaseUrl, supabaseKey } from '@/lib/supabase/supabase';

interface MenuItem {
  id: number;
  title: string;
  type: 'category' | 'custom' | 'external';
  category_slug?: string;
  custom_slug?: string;
  external_url?: string;
  display_order: number;
  is_visible: boolean;
  icon?: string;
}

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
                <Link href={getItemLink(item)}>
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

const getItemLink = (item: MenuItem): string => {
  switch (item.type) {
    case 'category':
      return `/posts/lists/${item.category_slug}`;
    case 'custom':
      return `/posts/lists/${item.custom_slug}`;
    case 'external':
      return item.external_url || '/';
    default:
      return '/';
  }
}

export default Header;

