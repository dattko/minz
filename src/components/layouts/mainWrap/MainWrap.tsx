import React from 'react';
import styles from './MainWrap.module.scss';
import Header from '../header/Header';

interface MainWrapProps {
  children: React.ReactNode;
}

const MainWrap: React.FC<MainWrapProps> = ({ children }) => {
  return (
    <div className={styles.main__wrap}>
      <Header />
      {children}
    </div>
  );
}

export default MainWrap;