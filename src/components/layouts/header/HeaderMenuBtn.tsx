'use client'
import React, {useEffect} from 'react';
import styles from './Header.module.scss';
import { Menu } from 'lucide-react';
import { useHeaderStore } from './headerStore';
import { usePathname } from 'next/navigation';

const HeaderMenuBtn: React.FC = () => {
  const toggleNav = useHeaderStore((state) => state.toggleNav);
  const isNavActive = useHeaderStore((state) => state.isNavActive);
  const resetNav = useHeaderStore(state => state.resetNav)
  const pathname = usePathname();

  useEffect(() => {
    resetNav();
  }, [pathname, resetNav]);

  return (
    <button className={`${styles.header__nav__btn} ${isNavActive ? styles.active : ''}`} onClick={toggleNav}>
      <Menu  size={20}/>
    </button>
  )
}

export default HeaderMenuBtn;