import React from 'react';
import Link from 'next/link';
import styles from './List.module.scss';
import Text from '@/components/text/Text';
import { Eye } from 'lucide-react';

export interface ListItem {
  id: string | number;
  title: string;
  date: string;
  views?: number;
  link: string;
  comments?: number;
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
            {item.comments !== undefined && (
              <Text variant='p' color='orange' fontSize='xs'>{item.comments}</Text>
            )}
          </div>
          <div className={styles.list__date}>
            <Text variant='p' color='gray'  fontSize='xs'>{item.date}</Text>
          </div>
          {showViews && item.views !== undefined && (
            <div className={styles.list__views}>
              <Eye size={12} color='gray'/>
              <Text variant='p' fontSize='xs' color='gray'>{item.views}</Text>
            </div>
          )}
        </li> 
      ))}
    </ul>
  );
};

export default List;