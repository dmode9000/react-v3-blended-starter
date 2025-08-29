// next & react
import Link from 'next/link';
// styles
import css from './Sidebar.module.css';
// types
import { User } from '@/types/user';

interface SidebarProps {
  users: User[];
  currentUser: string | undefined;
}

export default function Sidebar({ users, currentUser }: SidebarProps) {
  const isCurrentUser = (userId: User['id']) => userId.toString() === currentUser;
  const usersWithAll = [{ id: 'All', name: 'All users' }, ...users];
  return (
    users && (
      <ul className={css.menuList}>
        {usersWithAll.map((user) => (
          <li key={user.id} className={`${css.menuItem} ${isCurrentUser(user.id) && css.active}`}>
            <Link href={`/posts/filter/${user.id}`} className={css.menuLink}>
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}
