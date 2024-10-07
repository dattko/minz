import React, { ReactNode } from 'react';
import styles from './Content.module.scss';
import Text from '@/components/text/Text';
import Link from 'next/link';
interface ContentBoxProps {
  title?: string;
  link?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

const Content: React.FC<ContentBoxProps> = ({ title, link, children, className, maxWidth}) => {
  
  return (
    <div className={`${styles.content__box} ${className || ''}`} style={{maxWidth: maxWidth}}>
      {( title || link ) && (
        <div>
          {title && <Text variant='h4'>{title}</Text>}
          {link && <Link href={link}>
          <Text variant='p'>바로가기</Text>
          </Link>}
        </div>
        )
        }
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Content;