// LoginForm.tsx
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext'; // Add this import

const LoginForm: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login } = useAuth(); // Use AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      // Use AuthContext login instead of direct fetch
      const success = await login(username, password);
      
      if (success) {
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6" aria-label="Login form" onSubmit={handleSubmit}>
        <h1 className="text-white text-3xl font-bold text-center">
          Admin Portal
        </h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
              username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="user@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
