'use client'
import React, {useMemo} from 'react'
import Link from 'next/link'
import styles from './List.module.scss'
import Text from '@/components/text/Text'
import { Eye, Heart } from 'lucide-react'
import { formatDate } from '@/utils/utils'
import { getPostsByCategory } from '@/lib/action/postsAction'
import Pagination from '@/components/common/pagination/Pagination'
import { ListItem } from '@/types/dataType'
import { useQuery } from '@tanstack/react-query'

interface ListProps {
  categorySlug?: string
  showViews?: boolean
  simple?: boolean
  limit?: number
  basePath?: string
  currentPage?: number
  initialData?: { posts: ListItem[]; total: number }
  pagenation?: boolean
  posts?: ListItem[]; 
  total?: number;  
}

const List: React.FC<ListProps> = ({ 
 categorySlug, 
 showViews = false, 
 simple = false, 
 limit = 15, 
 basePath,
 currentPage = 1,
 initialData,
 pagenation = true,
}) => {
 const { data, isLoading, isError } = useQuery({
   queryKey: ['posts', categorySlug, currentPage, limit],
   queryFn: () => getPostsByCategory(categorySlug!, limit, currentPage),
   enabled: !!categorySlug,
   initialData: initialData,
 })

 const getFormattedDate = useMemo(() => (date: string) => {
  return simple ? 
    formatDate(date, { showTime: false, dateStyle: 'short' }) 
    : 
    formatDate(date, { dateStyle: 'short', timeStyle: 'short' });
}, [simple]);

 if (isError) return <div>게시글을 불러오는 중 오류가 발생했습니다.</div>

 const posts = data?.posts || []
 const total = data?.total || 0
 const totalPages = Math.ceil(total / limit)

 return (
   <>
     <ul className={styles.list__ul}>
       {posts.map((post) => (
         <li key={post.id} className={styles.list__li}>
           <div className={styles.list__title}>
             <Text variant='p' color='gray' fontSize='xs'>[{post.categoryName}]</Text>
             <Link href={`/posts/view/${post.category_slug}/${post.id}`}>
               <Text variant='p' ellipsis>{post.title}</Text>
             </Link>
             {post.comment_count > 0 && (
               <Text variant='p' color='orange' fontSize='xs'>{post.comment_count}</Text>
             )}
           </div>
           {!simple && (
             <div className={styles.list__author}>
               <Text variant='p' fontSize='xs'>{post.author}</Text>
             </div>
           )}
           {(showViews || !simple) && (
             <div className={styles.list__views}>
               <Eye size={12} color='gray'/>
               <Text variant='p' fontSize='xs' color='gray'>{post.unique_views}</Text>
             </div>
           )}
           {!simple && (
             <div className={styles.list__views}>
               <Heart size={12} color='gray'/>
               <Text variant='p' fontSize='xs' color='gray'>{post.recommendations}</Text>
             </div> 
           )}
           <div className={styles.list__info}>
             <Text variant='p' color='gray' fontSize='xs'>
              {getFormattedDate(post.created_at)}
             </Text>
           </div>
         </li> 
       ))}
     </ul>
     {pagenation && totalPages > 1 && (
       <Pagination
         initialPage={currentPage}
         totalPages={totalPages}
         basePath={basePath || `/posts/lists/${categorySlug}`}
       />
     )}
   </>
 )
}

export default List