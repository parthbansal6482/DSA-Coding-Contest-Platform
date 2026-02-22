import { useState, useEffect, useRef } from 'react';
import { Chrome, ArrowLeft } from 'lucide-react';
import { dualityGoogleLogin } from '../../services/duality.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = '929855839228-nqt4uc7sjuh1bbmsdejjq5hcelbv0gcb.apps.googleusercontent.com';

export function DualityAuth({
  onLogin,
  onBack
}: {
  onLogin: (userType: 'admin' | 'student', userName: string) => void;
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for Google Identity Services script to load
    const initializeGoogle = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 350,
        });
      }
    };

    // Check if script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      // Wait for the script to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initializeGoogle();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dualityGoogleLogin(response.credential);

      if (result.success) {
        // Store the duality token separately from the extended token
        localStorage.setItem('dualityToken', result.data.token);
        localStorage.setItem('dualityUser', JSON.stringify(result.data.user));

        onLogin(result.data.user.role, result.data.user.name);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
            Continue with your @bmu.edu.in Google account
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4 mb-4">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Signing in...</span>
            </div>
          )}

          {/* Google Sign-In Button (rendered by Google) */}
          <div className="flex justify-center">
            <div ref={googleButtonRef}></div>
          </div>

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
              Only @bmu.edu.in accounts are allowed. Your role (Admin/Student) is assigned automatically.
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
