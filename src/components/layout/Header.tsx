import { NotificationBadge } from './NotificationBadge';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-white dark:bg-gray-800 px-6">
      <div className="h-full flex items-center justify-end gap-4">
        <NotificationBadge count={3} />
        <UserMenu />
      </div>
    </header>
  );
}