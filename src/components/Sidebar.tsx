import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Calendar, FileText, BarChart3, Users, Image as ImageIcon, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/create-post', icon: PlusCircle, label: 'Create Post' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/posts', icon: FileText, label: 'Posts' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/campaigns', icon: Users, label: 'Campaigns' },
  { path: '/media', icon: ImageIcon, label: 'Media Library' },
  { path: '/social-accounts', icon: Users, label: 'Social Accounts' },
  { path: '/team', icon: Users, label: 'Team' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { business } = useBusiness();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src="/logo.png" alt="Hawa Social Hub" className="w-10 h-10 rounded-lg" />
          <div>
            <h1 className="font-bold text-hawa-blue">Hawa Social Hub</h1>
            <p className="text-xs text-gray-500">Social Media Management</p>
          </div>
        </Link>
      </div>

      {/* Business Selector */}
      {business && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Current Business</p>
            <p className="font-medium text-gray-900 truncate">{business.name}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                    isActive
                      ? 'bg-hawa-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-hawa-blue rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
