import axios from 'axios';
import { Post } from '@/types/post';
import { User } from '@/types/user';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

// API endpoints constants
export const API_ENDPOINTS = {
  POSTS: '/posts',
  USERS: '/users',
} as const;

// get
interface FetchPostsProps {
  searchText: string | undefined;
  page?: number;
  limit?: number;
  userId?: string;
}

interface FetchPostsResponse {
  posts: Post[];
  totalCount: number;
  totalPages: number;
}

export const fetchPosts = async (props: FetchPostsProps): Promise<FetchPostsResponse> => {
  const { searchText, page, limit = 10, userId } = props;

  const response = await axios.get<Post[]>(API_ENDPOINTS.POSTS, {
    params: {
      q: searchText,
      _page: page,
      _limit: limit,
      userId: userId,
    },
  });

  const posts = response.data;
  const totalCountHeader = response.headers['x-total-count'] || '0';
  const totalCount = parseInt(totalCountHeader);

  return {
    posts,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// create
type NewPostContent = Omit<Post, 'id' | 'userId'>;
export const createPost = async (newPost: NewPostContent): Promise<Post> => {
  // console.log('function run: createPost(' + newPost + ')');
  const response = await axios.post<Post>(API_ENDPOINTS.POSTS, newPost);
  return response.data;
};

// edit
type EditedPost = Omit<Post, 'userId'>;
export const editPost = async (newDataPost: EditedPost): Promise<Post> => {
  // console.log('function run: editPost(' + newDataPost + ')');
  const response = await axios.patch<Post>(`${API_ENDPOINTS.POSTS}/${newDataPost.id}`, newDataPost);
  return response.data;
};

// delete
export const deletePost = async (postId: Post['id']): Promise<Post> => {
  // console.log('function run: deletePost(' + postId + ')');
  const response = await axios.delete<Post>(`${API_ENDPOINTS.POSTS}/${postId}`);
  return response.data;
};

// get single post
export const fetchPostById = async (postId: Post['id']): Promise<Post> => {
  // console.log('function run: fetchPostById(' + postId + ')');
  const response = await axios.get<Post>(`${API_ENDPOINTS.POSTS}/${postId}`);
  return response.data;
};

// get all users
export const fetchUsers = async (): Promise<User[]> => {
  // console.log('function run: fetchUsers()');
  const response = await axios.get<User[]>(API_ENDPOINTS.USERS);
  return response.data;
};

// get single user
export const fetchUserById = async (userId: User['id']): Promise<User> => {
  // console.log('function run: fetchUserById(' + userId + ')');
  const response = await axios.get<User>(`${API_ENDPOINTS.USERS}/${userId}`);
  return response.data;
};
