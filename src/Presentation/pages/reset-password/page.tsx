import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = (location.state as any)?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateInputs = (): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/^\d{4,6}$/.test(otp)) return 'Enter a valid verification code';
    if (newPassword.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const clientError = validateInputs();
    if (clientError) {
      setError(clientError);
      return;
    }

    const API_URL = process.env.REACT_APP_API_BASE_URL ?? '';
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), otp, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.errors?.join?.(', ') || data.error || 'Password reset failed');
      }
      setSuccess(data.message || 'Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login', { state: { message: data.message } }), 1200);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2h12v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Reset Password</h1>
            <p className="text-sm text-gray-600">Enter the verification code sent to your email and choose a new password.</p>
          </div>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <label className="text-sm font-medium text-gray-700">Verification code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter code"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            inputMode="numeric"
            required
          />

          <label className="text-sm font-medium text-gray-700">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{success}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>}
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="flex-1 px-4 py-3 border rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;