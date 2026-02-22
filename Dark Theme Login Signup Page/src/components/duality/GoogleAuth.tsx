import { useState } from 'react';
import { Chrome, ArrowLeft } from 'lucide-react';

export function GoogleAuth({ 
  onLogin, 
  onBack 
}: { 
  onLogin: (userType: 'admin' | 'student', userName: string) => void; 
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google authentication
    setTimeout(() => {
      // For demo: randomly assign admin or student role
      // In production, this would be determined by the Google account/database
      const userName = 'Demo User';
      const userType = Math.random() > 0.5 ? 'student' : 'admin'; // Random for demo
      
      setIsLoading(false);
      onLogin(userType, userName);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform Selection</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Chrome className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Sign in to Duality
          </h1>
          <p className="text-gray-400">
            Continue with your Google account
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900 text-gray-500">
                Secure authentication
              </span>
            </div>
          </div>

          {/* Info Text */}
          <div className="space-y-3 text-sm text-gray-500 text-center">
            <p>
              Your account type (Admin or Student) will be automatically detected based on your credentials.
            </p>
            <p className="text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            <span>Access to all DSA problems</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            <span>Track your coding progress</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            <span>Build your coding profile</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>© 2026 Duality Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
