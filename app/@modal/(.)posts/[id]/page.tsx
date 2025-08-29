// libraries
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
// components
import PostPreviewClient from './PostPreview.client';
// api
import { fetchPostById } from '@/lib/api';

interface PostDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function PostPreview({ params }: PostDetailsProps) {
  const queryClient = new QueryClient();
  const { id } = await params;
  //console.log('postId: ' + id);
  // console.log('typeof postId: ' + typeof id);

  await queryClient.prefetchQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPostById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient />
    </HydrationBoundary>
  );
}
