import { NavLink } from 'react-router-dom';
import { Home, Search, Users, PieChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/marketing', icon: Search, label: 'Marketing' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/transactions', icon: PieChart, label: 'Transactions' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r h-full bg-white dark:bg-gray-800">
      <div className="h-16 border-b flex items-center px-6">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          MoreWays
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}