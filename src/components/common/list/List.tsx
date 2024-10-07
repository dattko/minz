import React from 'react';
import Link from 'next/link';
import styles from './List.module.scss';
import Text from '@/components/text/Text';

export interface ListItem {
  id: string | number;
  title: string;
  date: string;
  views?: number;
  link: string;
}

interface ListProps {
  items: ListItem[];
  showViews?: boolean;
}

const List: React.FC<ListProps> = ({ items, showViews = false }) => {
  return (
    <ul className={styles.list__ul}>
      {items.map((item) => (
        <li key={item.id} className={styles.list__li}>
          <div className={styles.list__title}>
            <Link href={item.link} >
              <Text variant='p' ellipsis>{item.title}</Text>
            </Link>
          </div>
          <div className={styles.list__date}>
            <Text variant='p' color='gray'>{item.date}</Text>
          </div>
          {showViews && item.views !== undefined && (
            <div className={styles.list__views}>
              <Text variant='p'>조회 {item.views}</Text>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default List;