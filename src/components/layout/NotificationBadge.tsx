import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationBadgeProps {
  count?: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon"
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  );
}