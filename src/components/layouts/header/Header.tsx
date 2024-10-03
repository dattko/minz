import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';

const Header = () => {
  return (
    <>
    <header className={styles.header}>
        <div className={styles.header__wrap}>
          <div className={styles.header__logo}>
            <Link href="/">Minz</Link>
          </div>
        </div>
        
    </header>
    <nav className={styles.nav}>
      <div className={styles.nav__wrap}>

      </div>
    </nav>
    </>
  );
}

export default Header;