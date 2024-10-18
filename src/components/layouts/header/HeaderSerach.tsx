'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';

const HeaderSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.header__search}>
      <input 
        type="text" 
        placeholder="검색어를 입력하세요..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.header__search__input}
      />
      <button type="submit" className={styles.header__search__btn}>검색</button>
    </form>
  );
};

export default HeaderSearch;