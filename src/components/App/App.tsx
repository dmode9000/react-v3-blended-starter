// React imports
import { useEffect, useState, useRef, useCallback } from "react";

// Library imports
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";

// Components
import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

// Services
import { fetchPosts } from "../../services/postService";

// Types
import { Post } from "../../types/post";

// Styles
import css from "./App.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"create" | "edit" | null>(null);
  // const [isCreatePost, setIsCreatePost] = useState(false);
  // const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  const debouncedSearchQuery = useDebouncedCallback((q) => {
    console.log("✅ Debounced! Setting search query to:", q);
    setCurrentPage(1);
    setSearchQuery(q);
  }, 500);

  const { data, isLoading, isSuccess, isPlaceholderData } = useQuery({
    queryKey: ["posts", currentPage, searchQuery],
    queryFn: () => {
      console.log("🚀 Making API request with query:", searchQuery);
      return fetchPosts({ searchText: searchQuery, page: currentPage });
    },
    placeholderData: keepPreviousData,
  });

  const prevSearchQueryRef = useRef<string>("");

  const { posts = [], totalCount = 0, totalPages = 0 } = data || {};

  useEffect(() => {
    if (isSuccess && !isPlaceholderData && searchQuery !== prevSearchQueryRef.current) {
      if (searchQuery) {
        toast.success(`Found ${totalCount} posts for "${searchQuery}"`);
      } else if (prevSearchQueryRef.current) {
        toast.success(`Search cleared. Found ${totalCount} total posts.`);
      }

      // Оновлюєю ref після того, як toast був показаний
      prevSearchQueryRef.current = searchQuery;
    }
  }, [isSuccess, isPlaceholderData, totalCount, searchQuery]);

  const handleSearchBox = useCallback((value: string) => {
    console.log("➡️ Input value changed:", value);
    setInputValue(value);
    debouncedSearchQuery(value);
  }, []);

  const handleEditPost = useCallback((post: Post) => {
    setEditedPost(post);
    setModalContent("edit");
    setIsModalOpen(true);
  }, []);

  const handleCreatePost = useCallback(() => {
    setModalContent("create");
    setIsModalOpen(true);
  }, []);

  const handlePageChange = useCallback((selected: number) => setCurrentPage(selected), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* SearchBox component*/}
        <SearchBox onSearch={handleSearchBox} value={inputValue} />

        {isLoading && <b>Loading posts...</b>}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={handleCreatePost}>
          Create post
        </button>
      </header>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {modalContent === "create" && <CreatePostForm onClose={handleCloseModal} />}
          {modalContent === "edit" && editedPost && (
            <EditPostForm
              onCansel={handleCloseModal}
              id={editedPost.id}
              oldTitle={editedPost.title}
              oldBody={editedPost.body}
            />
          )}
        </Modal>
      )}

      {posts && <PostList posts={posts} toggleEditPost={handleEditPost} toggleModal={openModal} />}

      <Toaster />
    </div>
  );
}
