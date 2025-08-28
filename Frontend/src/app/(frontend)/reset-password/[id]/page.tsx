'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const params = useParams();
  const token = params?.id ?? ''; // Safely get token or empty string

  // Optional: show error if token is missing
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">Invalid or missing reset token.</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/user/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (res.ok) {
        setSuccessMessage('Password successfully updated! Redirecting to login...');
        setFormData({ password: '', confirmPassword: '' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Error resetting password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecf2ff] via-white to-[#f8faff] flex items-center justify-center p-4 w-full relative">
      {/* Decorative Images */}
      <div className="absolute top-10 right-10 opacity-10">
        <Image src="/hero2.png" alt="decoration" width={60} height={55} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Image src="/hero4.png" alt="decoration" width={80} height={25} />
      </div>
      <div className="absolute top-1/3 right-5 opacity-5">
        <Image src="/hero1.png" alt="decoration" width={90} height={80} />
      </div>

      {/* Reset Password Form */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-[#7d42fb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:shadow-3xl transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  required
                  className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-[#7d42fb] focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  required
                  className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-[#7d42fb] focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Messages */}
            {errorMessage && <div className="text-red-500 text-sm text-center">{errorMessage}</div>}
            {successMessage && <div className="text-green-500 text-sm text-center">{successMessage}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7d42fb] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#6a35d9] focus:outline-none focus:ring-4 focus:ring-[#7d42fb]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Back to{' '}
              <button
                onClick={navigateToLogin}
                className="text-[#7d42fb] font-semibold hover:underline transition-all duration-200 hover:text-[#6a35d9]"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          © 2024 AI Tools Cover. All rights reserved.
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
