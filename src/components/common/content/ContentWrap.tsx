import React, { ReactNode } from 'react';
import styles from './ContentWrap.module.scss';
import { Columns } from 'lucide-react';

interface ContentWrapProps {
  children: ReactNode;
  className?: string;
  col?: 1 | 2 | 3 | 4 | 5;
  column?: boolean;
}

const ContentWrap: React.FC<ContentWrapProps> = ({ children, className, col, column}) => {
  
  return (
    <div className={`${styles.content__wrap} ${className || ''} ${col && styles['col-' + col]}`}  style={column ? { flexDirection: 'column' } : undefined}>
      {children}
    </div>
  );
};

export default ContentWrap;