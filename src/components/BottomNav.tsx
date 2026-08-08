import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Calendar, BarChart3, User } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/create-post', icon: PlusCircle, label: 'Create' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-around py-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition min-w-0',
              isActive ? 'text-hawa-blue' : 'text-gray-500'
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
