'use client';

// next & react
import { useParams } from 'next/navigation';
import { useState } from 'react';
// other libraries
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
// components
import PostList from '@/components/PostList/PostList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import EditPostForm from '@/components/EditPostForm/EditPostForm';
import CreatePostForm from '@/components/CreatePostForm/CreatePostForm';
// api
import { fetchPosts } from '@/lib/api';
// types
import { Post } from '@/types/post';
// styles
import css from './page.module.css';

interface PostsClientProps {
  initialData?: {
    posts: Post[];
    totalCount: number;
    totalPages: number;
  };
  userId?: string;
}

export default function PostsFilteredClient({ userId }: PostsClientProps) {
  const params = useParams<{ slug: string[] }>();
  userId = params.slug[0];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const queryPops = {
    searchText: searchQuery,
    page: currentPage,
    ...(userId !== 'All' && { userId }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['posts', queryPops],
    queryFn: () => fetchPosts(queryPops),
    placeholderData: keepPreviousData,
  });

  // console.log('data in PostsFilteredClient: ', data);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const toggleEditPost = (post: Post) => {
    setEditedPost(post);
    setIsModalOpen(true);
  };

  const changeSearchQuery = useDebouncedCallback((newQuery: string) => {
    setCurrentPage(1);
    setSearchQuery(newQuery);
  }, 300);

  if (isLoading) return <div className={css.loading}>Loading...</div>;
  const totalPages = data?.totalPages || 1;
  const posts = data?.posts ?? [];

  return (
    <div className={css.app}>
      <main className={css.main}>
        <section className={css.postsSection}>
          <header className={css.toolbar}>
            <SearchBox onSearch={changeSearchQuery} />
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}

            <button
              className={css.button}
              onClick={() => {
                toggleModal();
              }}
            >
              Create post +
            </button>
          </header>
          {isModalOpen && (
            <Modal onClose={toggleModal}>
              {editedPost ? (
                <EditPostForm
                  initialValues={editedPost}
                  onClose={() => {
                    toggleModal();
                    setEditedPost(null);
                  }}
                />
              ) : (
                <CreatePostForm onClose={toggleModal} />
              )}
            </Modal>
          )}
          {posts.length > 0 && (
            <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />
          )}
        </section>
      </main>
    </div>
  );
}
