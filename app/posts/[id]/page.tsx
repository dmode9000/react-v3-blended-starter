// next & react
import { Metadata } from 'next';
// other libraries
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
// components
import PostDetailsClient from './PostDetails.client';
// api
import { fetchPostById } from '@/lib/api';

// metadata generation
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await fetchPostById(id);

    return {
      title: post.title,
      description: post.body.substring(0, 30) + '...',
    };
  } catch {
    return {
      title: 'Post not found',
      description: 'This post could not be found.',
    };
  }
}

// server component
interface PostDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetails({ params }: PostDetailsProps) {
  //отримую id з url
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPostById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailsClient />
    </HydrationBoundary>
  );
}
