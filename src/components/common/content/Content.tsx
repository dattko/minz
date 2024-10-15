import React, { ReactNode } from 'react';
import styles from './Content.module.scss';
import Text from '@/components/text/Text';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
interface ContentBoxProps {
  title?: string;
  link?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  color?: string;
}

const Content: React.FC<ContentBoxProps> = ({ title, link, children, className, maxWidth}) => {
  
  return (
    <div className={`${styles.content__box} ${className && styles['content__' + className]}`} style={{maxWidth: maxWidth}}>
      {( title || link ) && (
        <div className={`${styles.content__header} `}>
          {title && <Text variant='h4' >{title}</Text>}
          {link && <Link href={link}>
            <SquareArrowOutUpRight size={14} />
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