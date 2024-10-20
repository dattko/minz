'use client'
import React from 'react';
import styles from './Header.module.scss';
import { Menu } from 'lucide-react';
import { useHeaderStore } from './headerStore';

const HeaderMenuBtn: React.FC = () => {
  const toggleNav = useHeaderStore((state) => state.toggleNav);

  return (
    <button className={styles.header__nav__btn} onClick={toggleNav}>
      <Menu  size={20}/>
    </button>
  )
}

export default HeaderMenuBtn;