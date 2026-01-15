import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, FileText, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabase';
import './Login.css';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, signUp, signInWithGoogle, loading } = useAuthStore();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    // If Supabase is not configured, show setup instructions
    if (!isSupabaseConfigured()) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-header">
                        <div className="login-logo">
                            <FileText size={32} />
                        </div>
                        <h1>Resume Builder</h1>
                        <p className="login-subtitle">Setup Required</p>
                    </div>

                    <div className="setup-notice">
                        <h3>⚠️ Supabase Not Configured</h3>
                        <p>To enable authentication and cloud storage, you need to:</p>
                        <ol>
                            <li>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
                            <li>Copy your project URL and anon key from Settings → API</li>
                            <li>Create a <code>.env.local</code> file with:
                                <pre>
                                    VITE_SUPABASE_URL=your-url{'\n'}
                                    VITE_SUPABASE_ANON_KEY=your-key
                                </pre>
                            </li>
                            <li>Restart the dev server</li>
                        </ol>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Continue in Local Mode
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const result = isSignUp
            ? await signUp(email, password)
            : await signIn(email, password);

        if (result.error) {
            setError(result.error.message);
        } else if (isSignUp) {
            setSuccess('Check your email to confirm your account!');
        } else {
            navigate(from, { replace: true });
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <FileText size={32} />
                    </div>
                    <h1>Resume Builder</h1>
                    <p className="login-subtitle">
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="login-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="spin" />
                                {isSignUp ? 'Creating account...' : 'Signing in...'}
                            </>
                        ) : (
                            <>
                                {isSignUp ? 'Create Account' : 'Sign In'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-divider">
                    <span>or</span>
                </div>

                <button
                    type="button"
                    className="btn btn-google"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="login-toggle">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}>
                        {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </div>
    );
}
