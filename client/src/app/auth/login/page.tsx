import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

 
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication
      if (email === 'demo@example.com' && password === 'password') {
        setSuccess(true);
        // Simulate successful login and redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset feature would be implemented here');
  };

  const handleCreateAccount = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Login</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Logo and Welcome */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">TX</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your TrustXWallet account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-700 text-sm font-semibold block">
                Email Address
              </label>
              <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                  disabled={isLoading || success}
                  autoComplete="email"
                />
              </div>
              {email && !isValidEmail(email) && (
                <p className="text-red-500 text-xs">Please enter a valid email address</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-gray-700 text-sm font-semibold block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 text-sm hover:text-blue-700 transition"
                  disabled={isLoading || success}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-blue-500 transition">
                <div className="flex items-center">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                    disabled={isLoading || success}
                    autoComplete="current-password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 ml-2 transition"
                    disabled={isLoading || success}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {password && password.length < 6 && (
                <p className="text-red-500 text-xs">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading || success}
              />
              <label htmlFor="remember" className="text-gray-700 text-sm">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-2">
                <Check size={20} className="text-green-500" />
                <p className="text-green-700 text-sm">Login successful! Redirecting...</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || success || !email || !password || !isValidEmail(email) || password.length < 6}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                isLoading || success || !email || !password || !isValidEmail(email) || password.length < 6
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-100'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : success ? (
                <div className="flex items-center justify-center space-x-2">
                  <Check size={20} />
                  <span>Success!</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={handleCreateAccount}
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
                disabled={isLoading || success}
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6">
        <div className="text-center text-gray-500 text-sm">
          <p>Secure login powered by TrustXWallet</p>
          <p className="mt-1">Your security is our priority</p>
        </div>
      </div>
    </div>
  );
}