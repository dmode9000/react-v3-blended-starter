import Sidebar from '@/components/Sidebar/Sidebar';
import { fetchUsers } from '@/lib/api';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function SidebarNotes({ params }: Props) {
  const { slug } = await params;
  const currentUser = slug?.[0];
  const users = await fetchUsers();
  return <Sidebar users={users} currentUser={currentUser} />;
}
