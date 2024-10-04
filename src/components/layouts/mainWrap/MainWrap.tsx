import React from 'react';
import styles from './MainWrap.module.scss';
import Header from '../header/Header';

interface MainWrapProps {
  children: React.ReactNode;
}

const MainWrap: React.FC<MainWrapProps> = ({ children }) => {
  console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  return (
    <div className={styles.main__wrap}>
      <Header />
      <div className={styles.main__container}>
        <div className={styles.main}>
          <div className={styles.main__content}>
            {children}
          </div>
          <div className={styles.main__aside}>
            <div className={styles.main__login}>asd</div>
            <div className={styles.main__best}>asd</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainWrap;