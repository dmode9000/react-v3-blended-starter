// libraries
import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
// components
import PostsFilteredClient from './PostsFiltered.client';
// api services
import { fetchPostById, fetchPosts } from '@/lib/api';

// metadata generation
type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  try {
    const post = await fetchPostById(id);

    return {
      title: post.title,
      description: post.body.substring(0, 30) + '...',
    };
  } catch (error) {
    return {
      title: 'Post not found',
      description: 'This post could not be found.',
    };
  }
}

// server component
interface PostsFilteredPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PostsFilteredPage({ params }: PostsFilteredPageProps) {
  const userId = (await params).slug[0];
  const queryClient = new QueryClient();

  const queryParams = {
    searchText: '',
    page: 1,
    ...(userId !== 'All' && { userId }),
  };

  await queryClient.prefetchQuery({
    queryKey: ['posts', queryParams],
    queryFn: () => fetchPosts(queryParams),
  });

  // const response = await fetchPosts({ searchText: undefined, page: 1, userId: userId });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsFilteredClient />
    </HydrationBoundary>
  );
}
