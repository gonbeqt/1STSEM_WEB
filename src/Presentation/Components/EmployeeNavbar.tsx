import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/employee/home' },
  { label: 'History', to: '/employee/history' },
  { label: 'Settings', to: '/employee/settings' },
];

const EmployeeNavbar: React.FC = () => {
  const employeeProfile = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to parse user profile from localStorage', error);
      return null;
    }
  }, []);

  const displayName = useMemo(() => {
    if (!employeeProfile) return 'Employee';

    const fullName = employeeProfile.full_name || employeeProfile.name || employeeProfile.fullName;
    if (fullName) {
      return fullName;
    }

    const first = employeeProfile.first_name || employeeProfile.firstname || '';
    const last = employeeProfile.last_name || employeeProfile.lastname || '';
    const composed = `${first} ${last}`.trim();

    return composed.length > 0 ? composed : 'Employee';
  }, [employeeProfile]);

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('') || 'E';
  }, [displayName]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 text-sm font-semibold">{initials}</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-gray-900">Hi, {displayName}</h1>
            <p className="text-xs text-gray-500">How are you today?</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <nav className="border-t border-gray-200 bg-white lg:hidden">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default EmployeeNavbar;
