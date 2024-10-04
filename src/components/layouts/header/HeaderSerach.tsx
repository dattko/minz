import React from 'react';
import styles from './Header.module.scss';
const HeaderSearch: React.FC = () => {
  return (
    <div className={styles.header__search}>
      <input 
        type="text" 
        placeholder="헤더 검색..."
      />
      <button className={styles.header__search__btn}>검색</button>
    </div>
  );
};

export default HeaderSearch;