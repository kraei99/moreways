import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
}

export function SidebarItem({ to, icon: Icon, label, collapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
          collapsed && "justify-center px-2"
        )
      }
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}