// Services
import { memo } from "react";
import { deletePost } from "../../services/postService";

// Types
import { Post } from "../../types/post";

// Styles
import css from "./PostList.module.css";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (e: Post) => void;
}

function PostList({ posts, toggleModal, toggleEditPost }: PostListProps) {
  const onEdit = (post: Post) => {
    toggleModal();
    toggleEditPost(post);
  };

  const onDelete = (id: Post["id"]) => {
    deletePost(id);
    console.log("Post deleted", id);
  };
  return (
    <ul className={css.list}>
      {
        /* список постів, кожен з яких створює наступну розмітку */
        posts.map((post) => {
          const { id, title, body } = post;
          return (
            <li key={id} className={css.listItem}>
              <h2 className={css.title}>{id + " " + title}</h2>
              <p className={css.content}>{body}</p>
              <div className={css.footer}>
                <button className={css.edit} onClick={() => onEdit(post)}>
                  Edit
                </button>
                <button className={css.delete} onClick={() => onDelete(id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })
      }
    </ul>
  );
}

export default memo(PostList);
