import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { container } from '../../../di/container';
import { observer } from 'mobx-react-lite';
import { ForgotPasswordViewModel } from '../../../domain/viewmodel/ForgotPasswordViewModel';

const ForgotPassword = observer(() => {
  const navigate = useNavigate();
  const viewModel = useMemo<ForgotPasswordViewModel>(() => container.forgotPasswordViewModel(), []);

  const initialEmail = viewModel.formData.email ?? '';
  const [email, setEmail] = useState<string>(initialEmail);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoading(true);

      viewModel.setEmail(email.trim());
      const res = await viewModel.requestPasswordReset(email.trim());

      if (res.success) {
        setSuccess(res.message || 'Verification code sent. Check your email.');
        navigate('/password-reset', { state: { email: email.trim() } });
        return;
      }

      const requestError = res.errors?.[0] || res.message || 'Failed to request verification code';
      throw new Error(requestError);
    } catch (err: any) {
      setError(err?.message || 'Failed to request verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-50">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Forgot Password</h1>
            <p className="text-sm text-gray-600">Enter your email to receive a verification code to reset your password.</p>
          </div>
        </div>

        <form onSubmit={handleRequestOtp} className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60"
          >
            {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>}
            {loading ? 'Requesting...' : 'Send verification code'}
          </button>

          <div className="text-sm text-center text-gray-600">
            Remembered your password? <button type="button" onClick={() => navigate('/login')} className="text-purple-600 font-medium">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ForgotPassword;