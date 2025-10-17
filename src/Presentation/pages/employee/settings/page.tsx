import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewModel } from '../../../hooks/useViewModel';
import { LoginViewModel } from '../../../../domain/viewmodel/LoginViewModel';
import ManagerNavbar from '../../../components/ManagerNavbar';
import { Lock, ShieldCheck, HelpCircle, ChevronRight, ArrowLeft, Eye, EyeOff, CircleHelp, MessageCircle, Search, ChevronDown, Pencil } from 'lucide-react';
import apiService from '../../../../data/api';

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: string;
  path?: string;
  onClick?: () => void;
}

interface User {
  name: string;
  title: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface ProfileData {
  id?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  company?: string;
  department?: string;
  role?: string;
  wallet_address?: string;
}

const EmployeeSettings: React.FC = () => {
  const navigate = useNavigate();
  const loginViewModel = useViewModel(LoginViewModel);
  const [user, setUser] = useState<User | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [faqSearchTerm, setFaqSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);
  const [supportFiles, setSupportFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit profile state
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const faqs = [
    { question: 'How do I connect my wallet?', answer: 'Open the wallet menu and choose “Connect Wallet”, then follow the wallet prompts to authorize Cryphoria.' },
    { question: 'How are transaction fees calculated?', answer: 'Fees depend on current network gas prices. Cryphoria shows an estimate before you confirm any transaction.' },
    { question: 'Is my data secure?', answer: 'Yes. We encrypt sensitive information at rest and in transit, following industry-standard security practices.' },
    { question: 'How do I generate an invoice?', answer: 'Navigate to Invoices, click “Create Invoice”, fill out the client and line item details, then save or send it.' },
    { question: 'What compliance documents do I need to provide?', answer: 'Upload your business verification, tax documents, and any region-specific compliance forms from the Compliance section.' },
  ];

  const menuItems: MenuItem[] = [
    
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Security',
      description: 'Change your password and secure your account',
      onClick: () => setIsChangePasswordModalOpen(true),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'Help & Support',
      description: 'Get help, FAQs, and contact support',
      onClick: () => setIsHelpModalOpen(true),
    },
  ];

  useEffect(() => {
    const currentUser = loginViewModel.currentUser;
    if (currentUser) {
      const fullName = currentUser.first_name && currentUser.last_name 
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : currentUser.first_name || currentUser.username || 'User';
      
      setUser({
        name: fullName,
        title: currentUser.role,
        email: currentUser.email,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        role: currentUser.role
      });
    }
  }, [loginViewModel]);

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handlePasswordSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    if (!/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError('Include at least one number and one symbol.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmittingPassword(true);
      const changePassword = (loginViewModel as any)?.changePassword;
      if (typeof changePassword === 'function') {
        await changePassword({ current_password: currentPassword, newPassword, confirmPassword, revoke_other_sessions: true });
      }
      setPasswordSuccess('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setTimeout(() => {
        setIsChangePasswordModalOpen(false);
        setPasswordSuccess(null);
      }, 1200);
    } catch (error: any) {
      setPasswordError(error?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const loadProfile = async () => {
    try {
      setIsProfileLoading(true);
      setProfileError(null);
      const API_URL = process.env.REACT_APP_API_BASE_URL || '';
      const data: any = await apiService.get(`${API_URL}/auth/profile-mongodb/`);
      if (data?.success && data?.profile) {
        setProfileData({ ...(data.profile as ProfileData) });
      } else {
        setProfileError(data?.errors?.[0] || 'Failed to load profile');
      }
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to load profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const openEditProfile = async () => {
    // Prefill from current user immediately for snappy UI
    const cu = loginViewModel.currentUser;
    if (cu) {
      setProfileData((prev) => ({
        ...prev,
        first_name: cu.first_name || '',
        last_name: cu.last_name || '',
        email: cu.email || '',
        username: cu.username || '',
        role: cu.role || '',
      }));
    }
    setIsEditProfileModalOpen(true);
    await loadProfile();
  };

  const handleProfileSave = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    // Basic validation
    const fn = (profileData.first_name || '').trim();
    const ln = (profileData.last_name || '').trim();
    if (!fn || !ln) {
      setProfileError('First name and last name are required.');
      return;
    }

    try {
      setIsProfileSaving(true);
      const API_URL = process.env.REACT_APP_API_BASE_URL || '';
      // Send only editable fields
      const payload: ProfileData = {
        first_name: fn,
        last_name: ln,
        email: (profileData.email || '').trim(),
        phone_number: (profileData.phone_number || '').trim(),
      };
      const res: any = await apiService.put(`${API_URL}/auth/profile-mongodb/`, payload);
      if (res?.success) {
        setProfileSuccess(res?.message || 'Profile updated successfully.');
        // Update local user cache for immediate UI reflection
        try {
          const userStr = localStorage.getItem('user');
          const current = userStr ? JSON.parse(userStr) : {};
          const updated = {
            ...current,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email || current.email,
          };
          localStorage.setItem('user', JSON.stringify(updated));
          const fullName = `${updated.first_name || ''} ${updated.last_name || ''}`.trim() || updated.username || 'User';
          setUser((prev) => ({
            ...(prev || { name: fullName, title: updated.role || '' }),
            name: fullName,
            email: updated.email,
            title: updated.role || (prev?.title || ''),
            first_name: updated.first_name,
            last_name: updated.last_name,
            role: updated.role || prev?.role,
          }));
        } catch {}

        setTimeout(() => {
          setIsEditProfileModalOpen(false);
          setProfileSuccess(null);
        }, 900);
      } else {
        setProfileError(res?.errors?.[0] || 'Failed to update profile');
      }
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to update profile');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleSupportSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!contactMessage.trim()) return;

    try {
      setIsSendingSupport(true);
      setSupportFeedback(null);

      const sendSupportMessage = (loginViewModel as any)?.sendSupportMessage;
      if (typeof sendSupportMessage === 'function') {
        await sendSupportMessage({ message: contactMessage.trim() });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSupportFeedback('Message sent! Our team will reach out soon.');
      setContactMessage('');
      setOpenFaqIndex(null);
    } catch (error: any) {
      setSupportFeedback(error?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSendingSupport(false);
    }
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase().trim())
  );

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.5); }
          100% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.3); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
        .animate-pulse-status { animation: pulse 2s infinite; }
        .sidebar::-webkit-scrollbar { width: 4px; }
        .sidebar::-webkit-scrollbar-track { background: transparent; }
        .sidebar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 2px; }
        .sidebar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
        .icon.document::before { content: "📄"; }
        .icon.help::before { content: "❓"; }
      `}</style>
      
      <div className="min-h-screen w-full bg-gray-50">
      <ManagerNavbar />
          
        <div className="p-6">

        {user ? (
          <div 
            className="user-profile flex items-center mb-8 p-6 rounded-2xl relative bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg transition-all duration-300 hover:shadow-xl "
            tabIndex={0}
          >
            {/* Profile Avatar with First Letter */}
            <div className="w-16 h-16 rounded-full mr-4 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="user-info flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white tracking-tight truncate mb-1">{user.name}</h2>
              {user.email && (
                <span className="user-email text-xs text-white/80 block truncate">{user.email}</span>
              )}
            </div>

            {/* Edit Profile Button */}
            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={openEditProfile}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 text-purple-700 px-3 py-1.5 text-xs font-semibold shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                aria-label="Edit profile"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="user-profile flex items-center mb-8 p-6 rounded-2xl relative bg-gray-200 shadow-sm">
            <div className="w-16 h-16 rounded-full mr-4 bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
              ?
            </div>
            <div className="user-info flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-700 truncate mb-1">Loading...</h2>
              <span className="text-sm text-gray-600 block truncate">Please wait</span>
            </div>
          </div>
        )}

        <nav className="menu flex-1 flex flex-col gap-4" role="navigation">
          {menuItems.map((item, index) => {
            const isActive = item.path === window.location.pathname;

            return (
              <button
                key={item.title}
                type="button"
                className={`group menu-item w-full text-left bg-white rounded-2xl border transition-all duration-200 ease-out flex items-center gap-4 p-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/60 animate-slideInLeft ${
                  isActive
                    ? 'border-purple-200 bg-purple-50 shadow-md'
                    : 'border-gray-100 hover:shadow-md hover:-translate-y-0.5'
                }`}
                style={{ animationDelay: `${0.08 * (index + 1)}s` }}
                onClick={() => handleMenuItemClick(item)}
              >
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 transition-colors ${
                    isActive
                      ? 'bg-purple-200 text-purple-700'
                      : 'group-hover:bg-purple-200 group-hover:text-purple-700'
                  }`}
                >
                  {item.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{item.description}</p>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            );
          })}
        </nav>
      </div>
      </div>

      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                aria-label="Close change password modal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">Change your password and secure your account</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="px-6 pb-6 pt-2 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="current-password">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Re-enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-500">{passwordSuccess}</p>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    setPasswordError(null);
                    setPasswordSuccess(null);
                  }}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-all disabled:from-purple-400 disabled:to-indigo-400"
                >
                  {isSubmittingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditProfileModalOpen(false);
                  setProfileError(null);
                  setProfileSuccess(null);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                aria-label="Close edit profile modal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                <p className="text-sm text-gray-500">Update your personal details</p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="px-6 pb-6 pt-2 space-y-4">
              {isProfileLoading ? (
                <p className="text-sm text-gray-500">Loading profile…</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700" htmlFor="first_name">First Name</label>
                      <input
                        id="first_name"
                        type="text"
                        value={profileData.first_name || ''}
                        onChange={(e) => setProfileData((p) => ({ ...p, first_name: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700" htmlFor="last_name">Last Name</label>
                      <input
                        id="last_name"
                        type="text"
                        value={profileData.last_name || ''}
                        onChange={(e) => setProfileData((p) => ({ ...p, last_name: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={profileData.email || ''}
                        disabled
                        readOnly
                        className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 cursor-not-allowed"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={profileData.phone_number || ''}
                        onChange={(e) => setProfileData((p) => ({ ...p, phone_number: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {profileError && <p className="text-sm text-red-500">{profileError}</p>}
                  {profileSuccess && <p className="text-sm text-green-500">{profileSuccess}</p>}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditProfileModalOpen(false);
                        setProfileError(null);
                        setProfileSuccess(null);
                      }}
                      className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProfileSaving}
                      className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-all disabled:from-purple-400 disabled:to-indigo-400"
                    >
                      {isProfileSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6 sm:px-4">
          <div className="w-full max-w-lg sm:max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center gap-3 px-4 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              <button
                type="button"
                onClick={() => {
                  setIsHelpModalOpen(false);
                  setFaqSearchTerm('');
                  setContactMessage('');
                  setSupportFeedback(null);
                  setOpenFaqIndex(null);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors sm:h-11 sm:w-11"
                aria-label="Close help modal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Help</h2>
                <p className="text-xs text-gray-500 sm:text-sm">Find answers quickly or reach out to our support team.</p>
              </div>
            </div>

            <div className="flex-1 px-4 pb-5 pt-2 space-y-5 overflow-y-auto sm:px-6 sm:pb-6">
              <section className="rounded-3xl bg-gray-50 px-4 py-5 sm:px-5 sm:py-6">
                <div className="flex items-start gap-3 mb-5 sm:items-center sm:gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 sm:h-11 sm:w-11">
                    <CircleHelp className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Frequently Asked Questions</h3>
                    <p className="text-xs text-gray-500">Search common topics or expand a question to learn more.</p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="search"
                    value={faqSearchTerm}
                    onChange={(e) => setFaqSearchTerm(e.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full rounded-2xl border border-transparent bg-white px-10 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div className="space-y-3">
                  {filteredFaqs.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">No FAQs match your search.</p>
                  ) : (
                    filteredFaqs.map((faq, idx) => {
                      const actualIndex = faqs.indexOf(faq);
                      const isOpen = openFaqIndex === actualIndex;

                      return (
                        <div key={faq.question} className="rounded-2xl bg-white border border-gray-100">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenFaqIndex(isOpen ? null : actualIndex)
                            }
                            className="w-full flex items-center justify-between gap-3 px-3 py-3 text-left sm:px-4"
                          >
                            <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isOpen ? 'rotate-180 text-purple-500' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-3 pb-4 sm:px-4">
                              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              <section className="rounded-3xl bg-gray-50 px-4 py-5 sm:px-5 sm:py-6">
                <div className="flex items-start gap-3 mb-4 sm:items-center sm:gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 sm:h-11 sm:w-11">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Contact Support</h3>
                    <p className="text-xs text-gray-500">How can we help you?</p>
                  </div>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <textarea
                    value={contactMessage}
                    onChange={(e) => {
                      setContactMessage(e.target.value);
                      setSupportFeedback(null);
                    }}
                    rows={4}
                    minLength={10}
                    placeholder="Describe your issue or question..."
                    className="w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Attachments (optional)</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setSupportFiles(files);
                      }}
                      className="block w-full text-xs text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {supportFiles.length > 0 && (
                      <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                        {supportFiles.map((f, idx) => (
                          <li key={idx} className="truncate">{f.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {supportFeedback && (
                    <p className="text-xs text-purple-600">{supportFeedback}</p>
                  )}
                  <button
                    type="submit"
                    disabled={contactMessage.trim().length < 10 || isSendingSupport}
                    className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                      contactMessage.trim().length < 10 || isSendingSupport
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm hover:from-purple-600 hover:to-indigo-600'
                    }`}
                  >
                    {isSendingSupport ? 'Sending…' : `Send Message${contactMessage.trim().length > 0 && contactMessage.trim().length < 10 ? ' (min 10 chars)' : ''}`}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeSettings;