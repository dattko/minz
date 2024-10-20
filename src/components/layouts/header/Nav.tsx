'use client'
import React, {useEffect} from 'react';
import styles from './Header.module.scss';
import Text from '@/components/text/Text';
import Link from 'next/link';
import { MenuItem } from '@/types/dataType';
import { notFound } from 'next/navigation';
import { useHeaderStore } from './headerStore';
import { usePathname } from 'next/navigation';


interface navProps {
  menuItems: MenuItem[];
  children?: React.ReactNode;
}
  
const nav: React.FC<navProps> = ({ menuItems, children }) => {
  const isNavActive = useHeaderStore(state => state.isNavActive);
  const resetNav = useHeaderStore(state => state.resetNav)
  const pathname = usePathname();

  useEffect(() => {
    resetNav();
  }, [pathname, resetNav]);

  const getItemLink = (item: MenuItem): string => {
    switch (item.type) {
      case 'category':
        return `/posts/lists/${item.category_slug}`;
      case 'custom':
        return `/posts/lists/${item.custom_slug}`;
      case 'external':
        return item.external_url || notFound();
      default:
        return notFound();
    }
  }

  return (
  <nav className={`${styles.nav} ${isNavActive ? styles.nav__active : ''}`}>
    <div className={styles.nav__wrap}>
      <div className={styles.nav__login}>
        {children}
      </div>
      <ul className={styles.nav__ul}>
        {menuItems.map((item: MenuItem) => (
          <li key={item.id} className={styles.nav__li}>
            <Link href={getItemLink(item)}>
              <Text variant='p'>{item.title}</Text>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
  )
}

export default nav;