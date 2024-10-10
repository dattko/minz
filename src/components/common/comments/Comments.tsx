import React from 'react';
import { User, MessageSquare, Trash, Pencil, CornerDownRight } from 'lucide-react';
import Text from '@/components/text/Text';
import styles from './Comments.module.scss';
import Btn from '../button/Btn';
import { comment } from '@/types/dataType';

interface CommentsProps {
  postId: number;
  initialComments: comment[];
}

const Comments: React.FC<CommentsProps> = ({ postId, initialComments }) => {
  return (
    <div className={styles.comments}>
      <div className={styles.comments__title}>
        <MessageSquare size={14} />
        <Text variant="h5">댓글 </Text>
        <Text variant="p" color="orange" fontSize='sm'>( {initialComments.length} )</Text>
      </div>
      <ul className={styles.comments__list}>
        {initialComments.map((comment, index) => (
          <li key={index} className={styles.comments__item}>
            <div className={styles.comments__header}>
              <div className={styles.comments__author}>
                <User size={14} />
                <Text variant="p" fontSize="sm">{comment.author}</Text>
                <div className={styles.comments__date}>
                  <Text variant="p" fontSize="xs" color="gray">{comment.date}</Text>
                </div>
              </div>
              <div className={styles.comments__stats}>
                <Btn size='icon' variant='none'><CornerDownRight /></Btn>
                <Btn size='icon' variant='none'><Pencil /></Btn>
                <Btn size='icon' variant='none'><Trash /></Btn>
              </div>
            </div>
            <div className={styles.comments__text}>
              <Text variant="p" fontSize='xs'>{comment.content}</Text>
            </div>
            
            {/* 대댓글 레이아웃 추가 */}
            <div className={styles.comments}>
              <ul className={styles.comments__list}>
                {comment.replies && comment.replies.map((reply, replyIndex) => (
                  <li key={replyIndex} className={styles.comments__reflyItem}>
                    <div className={styles.comments__replyIcon}>
                      <CornerDownRight size={16}/>
                    </div>
                    <div className={styles.comments__item}>
                      <div className={styles.comments__header}>
                        <div className={styles.comments__author}>
                          <User size={14} />
                          <Text variant="p" fontSize="sm">{reply.author}</Text>
                          <div className={styles.comments__date}>
                            <Text variant="p" fontSize="xs" color="gray">{reply.date}</Text>
                          </div>
                        </div>
                        <div className={styles.comments__stats}>
                          <Btn size='icon' variant='none'><Pencil /></Btn>
                          <Btn size='icon' variant='none'><Trash /></Btn>
                        </div>
                      </div>
                      <div className={styles.comments__text}>
                        <Text variant="p" fontSize='xs'>{reply.content}</Text>
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
              <form className={styles.comments__replyForm}>
                <textarea
                  maxLength={120}
                  placeholder="대댓글을 입력해 주세요."
                  className={styles.comments__input}
                />
                <Btn type="submit" size='small'>
                  작성
                </Btn>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <form className={styles.comments__form}>
        <textarea
          maxLength={120}
          placeholder="댓글을 입력해 주세요."
          className={styles.comments__input}
        />
        <Btn type="submit" size='small' variant='outline-primary'>
          작성
        </Btn>
      </form>
    </div>
  );
};

export default Comments;




