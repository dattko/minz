import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import HeaderSearch from './HeaderSerach';

const Header = () => {
  return (
    <>
    <header className={styles.header}>
        <div className={styles.header__wrap}>
          <div className={styles.header__logo}>
            <Link href="/">Minz</Link>
          </div>
          <HeaderSearch/>
        </div>
        
    </header>
    <nav className={styles.nav}>
      <div className={styles.nav__wrap}>
        <ul className={styles.nav__ul}>
          <li className={styles.nav__li}>
            <Link href="/about">공지사항</Link>
          </li>
          <li className={styles.nav__li}>
            <Link href="/posts">화제의글</Link>
          </li>
          <li className={styles.nav__li}>
            <Link href="/contact">자유게시판</Link>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
}

export default Header;