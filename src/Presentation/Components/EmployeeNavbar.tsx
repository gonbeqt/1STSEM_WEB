import React, { useMemo } from 'react';
import { Bell } from 'lucide-react';

const EmployeeNavbar: React.FC = () => {

  const managerProfile = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to parse user profile from localStorage', error);
      return null;
    }
  }, []);

  const displayName = useMemo(() => {
    if (!managerProfile) return 'Manager';

    const fullName = managerProfile.full_name || managerProfile.name || managerProfile.fullName;
    if (fullName) {
      return fullName;
    }

    const first = managerProfile.first_name || managerProfile.firstname || '';
    const last = managerProfile.last_name || managerProfile.lastname || '';
    const composed = `${first} ${last}`.trim();

    return composed.length > 0 ? composed : 'Manager';
  }, [managerProfile]);

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('') || 'M';
  }, [displayName]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
    </header>
  );
};

export default EmployeeNavbar;
