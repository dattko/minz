'use client';
import React, { useState, useEffect } from 'react';
import { User, MessageSquare, Trash, Pencil, CornerDownRight } from 'lucide-react';
import Text from '@/components/text/Text';
import styles from './Comments.module.scss';
import Btn from '../button/Btn';
import { Comment } from '@/types/dataType';
import { getUserInfo } from '@/components/auth/authSection/action';
import { fetchComments, addComment, addReply, editComment, deleteComment } from '@/lib/action/commentAction';
import { formatDate } from '@/utils/utils';

interface CommentsProps {
  postId: number;
  userInfo: any;
  initialComments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ postId, userInfo, initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const user = userInfo;
  const mainComments = comments.filter(comment => comment.parent_id === null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    await addComment(postId, newComment);
    setNewComment('');
    const updatedComments = await fetchComments(postId);
    setComments(updatedComments);
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (newReply.trim() === '') return;

    await addReply(postId, parentId, newReply);
    setNewReply('');
    setReplyingTo(null);
    const updatedComments = await fetchComments(postId);
    setComments(updatedComments);
  };

  const handleCommentEdit = async (commentId: number, newContent: string) => {
    if(window.confirm('댓글을 수정하시겠습니까?')){
      await editComment(commentId, newContent);
      setEditingComment(null);
      const updatedComments = await fetchComments(postId);
      setComments(updatedComments);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if(window.confirm('정말로 이 댓글을 삭제하시겠습니까?')){
      await deleteComment(commentId);
      const updatedComments = await fetchComments(postId);
      setComments(updatedComments);
    }
  };




  const playceholder = user ? '댓글을 입력해 주세요.' : '로그인 후 댓글을 작성할 수 있습니다.';

  return (
    <div className={styles.comments}>
      <div className={styles.comments__title}>
        <MessageSquare size={14} />
        <Text variant="h5">댓글 </Text>
        <Text variant="p" color="orange" fontSize='sm'>( {comments.length} )</Text>
      </div>
      <ul className={styles.comments__list}>
        {mainComments.map((comment) => (
          <li key={comment.id} className={styles.comments__item}>
            <div className={styles.comments__header}>
              <div className={styles.comments__author}>
                <User size={14} />
                <Text variant="p" fontSize="sm">{comment.author}</Text>
                <div className={styles.comments__date}>
                  <Text variant="p" fontSize="xs" color="gray">{formatDate(comment.created_at, {dateStyle: 'long'})}</Text>
                </div>
              </div>
              <div className={styles.comments__stats}>
                <Btn size='icon' variant='none' onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                  <CornerDownRight />
                </Btn>
                {user && user.id === comment.author_id && (
                  <>
                    <Btn size='icon' variant='none' onClick={() => setEditingComment(comment.id)}><Pencil /></Btn>
                    <Btn size='icon' variant='none' onClick={() => handleCommentDelete(comment.id)}><Trash /></Btn>
                  </>
                )}
              </div>
            </div>
            {editingComment === comment.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCommentEdit(comment.id, (e.target as any).content.value);
              }}>
                <textarea
                  name="content"
                  defaultValue={comment.content}
                  className={styles.comments__input}
                />
                <Btn type="submit" size='small'>수정</Btn>
              </form>
            ) : (
              <div className={styles.comments__text}>
                <Text variant="p" fontSize='xs'>{comment.content}</Text>
              </div>
            )}
            
            {/* 대댓글 레이아웃 */}
            <div className={styles.comments}>
              <ul className={styles.comments__list}>
                {comments.filter(reply => reply.parent_id === comment.id).map((reply) => (
                  <li key={reply.id} className={styles.comments__reflyItem}>
                    <div className={styles.comments__replyIcon}>
                      <CornerDownRight size={16}/>
                    </div>
                    <div className={styles.comments__item}>
                      <div className={styles.comments__header}>
                        <div className={styles.comments__author}>
                          <User size={14} />
                          <Text variant="p" fontSize="sm">{reply.author}</Text>
                          <div className={styles.comments__date}>
                            <Text variant="p" fontSize="xs" color="gray">{formatDate(reply.created_at, {dateStyle: 'long'})}</Text>
                          </div>
                        </div>
                        {user && user.id === reply.author_id && (
                          <div className={styles.comments__stats}>
                            <Btn size='icon' variant='none' onClick={() => setEditingComment(reply.id)}><Pencil /></Btn>
                            <Btn size='icon' variant='none' onClick={() => handleCommentDelete(reply.id)}><Trash /></Btn>
                          </div>
                        )}
                      </div>
                      {editingComment === reply.id ? (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleCommentEdit(reply.id, (e.target as any).content.value);
                        }}>
                          <textarea
                            name="content"
                            defaultValue={reply.content}
                            className={styles.comments__input}
                          />
                          <Btn type="submit" size='small'>수정</Btn>
                        </form>
                      ) : (
                        <div className={styles.comments__text}>
                          <Text variant="p" fontSize='xs'>{reply.content}</Text>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {replyingTo === comment.id && (
                <form className={styles.comments__replyForm} onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    maxLength={120}
                    placeholder={playceholder}
                    className={styles.comments__input}
                    disabled={!user}
                  />
                  <Btn type="submit" size='small' disabled={!user}>
                    작성
                  </Btn>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
      <form className={styles.comments__form} onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={120}
          placeholder={playceholder}
          className={styles.comments__input}
          disabled={!user}
        />
        <Btn type="submit" size='small' variant='outline-primary' disabled={!user}>
          작성
        </Btn>
      </form>
    </div>
  );
};

export default Comments;