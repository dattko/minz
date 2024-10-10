import React from 'react';
import styles from './MainWrap.module.scss';
import Header from '../header/Header';
import AuthSection from '@/components/auth/authSection/AuthSection';
import Text from '@/components/text/Text';
import { headers } from 'next/headers'
interface MainWrapProps {
  children: React.ReactNode;
}

const MainWrap: React.FC<MainWrapProps> = ({ children }) => {
  const headersList = headers();
  const pathname = headersList.get('X-Pathname')
  const postStartPathname = pathname?.startsWith('/posts');



  return (
    <div className={styles.main__wrap}>
      <Header />
      <div className={styles.main__container}>
        <div className={styles.main}>
          <div className={styles.main__content}>
            {/* {postStartPathname &&
              <div className={styles.main__content__header}>
                <Text variant='h2'>메인</Text>
              </div>
            } */}
            {children}
          </div>
          <div className={styles.main__aside}>
            <div className={styles.main__login}>
              <AuthSection />
            </div>
            <div className={styles.main__best}>asd</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainWrap;