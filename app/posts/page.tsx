import { fetchPosts } from '@/lib/api';

import PostsClient from './Posts.client';
//import { useParams } from 'next/navigation';

const response = await fetchPosts({ searchText: undefined, page: 1 });

export default async function PostsPage() {
  // const useParams;
  return (
    <>
      <PostsClient initialData={response} userId="All" />
    </>
  );
}
