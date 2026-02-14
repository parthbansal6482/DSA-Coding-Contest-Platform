import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';
import { LogIn, ArrowLeft } from 'lucide-react';

interface DualityAuthProps {
    onLogin: () => void;
    onBack: () => void;
}

export function DualityAuth({ onLogin, onBack }: DualityAuthProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError(null);
        try {
            const { credential } = credentialResponse;
            // Note: We'll implement this endpoint next
            const response = await axios.post('/api/duality/auth/google', {
                idToken: credential
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', 'duality-user');
                onLogin();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Google Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Selection
                </button>   

                <div className="bg-white border border-zinc-800 rounded-3xl p-8 text-center">
                    <h1 className="text-3xl font-bold text-black mb-2">Welcome to Duality</h1>
                    <p className="text-black-400 mb-8">Sign in with your college email to start solving.</p>

                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Sign-In was unsuccessful. Try again.')}
                            useOneTap
                            theme="filled_black"
                            shape="pill"
                            text="continue_with"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-500 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <p className="text-zinc-500 text-sm animate-pulse">Verifying credentials...</p>
                    )}

                    <div className="pt-6 border-t border-zinc-800">
                        <p className="text-zinc-500 text-xs">
                            Only @bmu.edu.in domains are authorized to access this section.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
