import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export function AdminAuth({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin form submitted:', formData);
    // Handle admin authentication logic here
    // For demo purposes, login immediately
    onLogin();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isLogin ? 'Admin Login' : 'Admin Registration'}
        </h1>
        <p className="text-gray-400">
          {isLogin
            ? 'Access the competition dashboard'
            : 'Create an admin account'}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field (Signup only) */}
          {!isLogin && (
            <div>
              <label htmlFor="admin-name" className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  id="admin-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-12 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="admin-email" className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                id="admin-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-12 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="admin-password" className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-12 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password (Login only) */}
          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors mt-6"
          >
            {isLogin ? 'Sign In as Admin' : 'Create Admin Account'}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-white hover:underline font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}