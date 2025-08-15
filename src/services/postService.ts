import axios from "axios";
import type { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

// get
interface FetchPostsProps {
  searchText: string | undefined;
  page?: number;
  limit?: number;
}

interface FetchPostsResponse {
  posts: Post[];
  totalCount: number;
  totalPages: number;
}

export const fetchPosts = async (props: FetchPostsProps): Promise<FetchPostsResponse> => {
  const { searchText, page, limit = 10 } = props;

  const response = await axios.get<Post[]>("/posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: limit,
    },
  });

  const posts = response.data;
  const totalCountHeader = response.headers["x-total-count"] || "0";
  const totalCount = parseInt(totalCountHeader);

  return {
    posts,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// create
type NewPostProps = Omit<Post, "id">;
export const createPost = async (newPost: NewPostProps): Promise<Post> => {
  console.log("function run: createPost(" + newPost + ")");
  const response = await axios.post<Post>(`/posts`, newPost);
  return response.data;
};

// edit
export const editPost = async (
  postId: Post["id"],
  newDataPost: { title: string; body: string }
): Promise<Post> => {
  console.log("function run: editPost(" + postId + ", " + newDataPost + ")");
  const response = await axios.put<Post>(`/posts/${postId}`, newDataPost);
  return response.data;
};

// delete
export const deletePost = async (postId: Post["id"]): Promise<Post> => {
  console.log("function run: deletePost(" + postId + ")");
  const response = await axios.delete<Post>(`/posts/${postId}`);
  return response.data;
};
