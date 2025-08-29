'use client';

// next & react
import { useParams, useRouter } from 'next/navigation';
// other libraries
import { useQuery } from '@tanstack/react-query';
// api
import { fetchPostById, fetchUserById } from '@/lib/api';
// styles
import css from './PostDetails.module.css';
// types
import { User } from '@/types/user';
import { Post } from '@/types/post';

export default function PostDetailsClient() {
  const router = useRouter();
  const handleClickBack = () => {
    router.back();
  };

  const { id } = useParams();

  const {
    data: post,
    isLoading: isLoadingPost,
    isError: isPostError,
    error: postEror,
  } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPostById(id as Post['id']),
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ['user', post?.userId],
    queryFn: () => fetchUserById(post?.userId as User['id']),
    enabled: post?.userId !== undefined,
  });

  if (isLoadingPost) {
    return <div className={css.content}>Loading post...</div>;
  }

  if (isPostError) {
    return <div className={css.content}>Error: {postEror.message}</div>;
  }

  const userNameText = isLoadingUser
    ? 'Loading...'
    : isUserError
    ? `Error: ${userError.message}`
    : user?.name;

  return (
    <>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClickBack}>
            ← Back
          </button>

          <div className={css.post}>
            <div className={css.wrapper}>
              <div className={css.header}>
                <h2>{post?.title}</h2>
              </div>

              <p className={css.content}>{post?.body}</p>
            </div>
            <p className={css.user}>User: {userNameText}</p>
          </div>
        </div>
      </div>
    </>
  );
}
