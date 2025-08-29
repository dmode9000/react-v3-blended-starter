'use client';
// next & react
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// other libraries
import { useQuery } from '@tanstack/react-query';
// components
import Modal from '@/components/Modal/Modal';
// api
import { fetchPostById, fetchUserById } from '@/lib/api';
// styles
import css from './PostPreview.module.css';
// types
import { User } from '@/types/user';
import { Post } from '@/types/post';

export default function PostPreviewClient() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: post,
    isLoading: isLoadingPost,
    isError: isPostError,
    error: postEror,
  } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPostById(id as Post['id']),
    refetchOnMount: false,
  });

  if (isLoadingPost) {
    return <div className={css.content}>Loading post...</div>;
  }

  if (isPostError) {
    return <div className={css.content}>Error: {postEror.message}</div>;
  }

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ['user', post?.userId],
    queryFn: () => fetchUserById(post?.userId as User['id']),
    refetchOnMount: false,
  });

  const userNameText = isLoadingUser
    ? 'Loading...'
    : isUserError
    ? `Error: ${userError.message}`
    : user?.name;

  return (
    <Modal>
      <button className={css.backBtn} onClick={() => router.back()}>
        ← Back
      </button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post?.title}</h2>
          </div>

          <p className={css.content}>{post?.body}</p>
        </div>
        <p className={css.user}>Author: {userNameText}</p>
      </div>
    </Modal>
  );
}
