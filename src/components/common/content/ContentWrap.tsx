import React, { ReactNode } from 'react';
import styles from './ContentWrap.module.scss';

interface ContentWrapProps {
  children: ReactNode;
  className?: string;
  col?: 2 | 3 | 4 | 5;
}

const ContentWrap: React.FC<ContentWrapProps> = ({ children, className, col}) => {
  
  return (
    <div className={`${styles.content__wrap} ${className || ''} ${col && styles['col-' + col]}`} >
      {children}
    </div>
  );
};

export default ContentWrap;