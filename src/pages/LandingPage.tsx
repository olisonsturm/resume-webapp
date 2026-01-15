import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Zap, Shield, Github, Sparkles, Download, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './LandingPage.css';

export function LandingPage() {
    const navigate = useNavigate();
    const { user, signIn, signUp, signInWithGoogle, signInWithGithub, loading } = useAuthStore();

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email || !password) {
            setError('Bitte E-Mail und Passwort eingeben');
            return;
        }

        if (password.length < 6) {
            setError('Passwort muss mindestens 6 Zeichen lang sein');
            return;
        }

        const result = isSignUp
            ? await signUp(email, password)
            : await signIn(email, password);

        if (result.error) {
            setError(result.error.message);
        } else if (isSignUp) {
            setSuccess('Bestätigungsmail gesendet! Bitte E-Mail prüfen.');
        } else {
            navigate('/dashboard');
        }
    };

    const handleGoogleAuth = async () => {
        setError(null);
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error.message);
        }
    };

    const handleGithubAuth = async () => {
        setError(null);
        const result = await signInWithGithub();
        if (result.error) {
            setError(result.error.message);
        }
    };

    const features = [
        {
            icon: <Sparkles size={24} />,
            title: 'KI-gestütztes Design',
            description: 'Professionelle Vorlagen, die ATS-optimiert sind'
        },
        {
            icon: <Download size={24} />,
            title: 'PDF Export',
            description: 'Perfekt formatierte PDFs in Sekunden'
        },
        {
            icon: <Shield size={24} />,
            title: 'Sichere Cloud',
            description: 'Deine Daten sind sicher in der Cloud gespeichert'
        },
        {
            icon: <Zap size={24} />,
            title: 'LinkedIn Import',
            description: 'Importiere dein LinkedIn-Profil mit einem Klick'
        }
    ];

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-brand">
                    <FileText size={28} />
                    <span>applyro</span>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAuthModal(true)}>
                    Jetzt starten
                    <ArrowRight size={16} />
                </button>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Kostenlos starten</span>
                    </div>
                    <h1>
                        Erstelle deinen <span className="gradient-text">perfekten Lebenslauf</span> in Minuten
                    </h1>
                    <p className="hero-subtitle">
                        Professionelle Lebensläufe und Anschreiben, die Personaler beeindrucken.
                        Mit KI-gestützten Vorlagen und einfachem PDF-Export.
                    </p>
                    <div className="hero-cta">
                        <button className="btn btn-primary btn-large" onClick={() => setShowAuthModal(true)}>
                            Kostenlos erstellen
                            <ArrowRight size={18} />
                        </button>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">10k+</span>
                                <span className="stat-label">Nutzer</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">50k+</span>
                                <span className="stat-label">CVs erstellt</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="cv-preview-card">
                        <div className="preview-header">
                            <div className="preview-avatar"></div>
                            <div className="preview-info">
                                <div className="preview-name"></div>
                                <div className="preview-title"></div>
                            </div>
                        </div>
                        <div className="preview-section">
                            <div className="preview-line long"></div>
                            <div className="preview-line medium"></div>
                            <div className="preview-line short"></div>
                        </div>
                        <div className="preview-section">
                            <div className="preview-line long"></div>
                            <div className="preview-line medium"></div>
                        </div>
                    </div>
                    <div className="floating-badge badge-1">
                        <Check size={16} /> ATS-optimiert
                    </div>
                    <div className="floating-badge badge-2">
                        <Download size={16} /> PDF Export
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Alles was du brauchst</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Bereit durchzustarten?</h2>
                    <p>Erstelle jetzt deinen professionellen Lebenslauf</p>
                    <button className="btn btn-primary btn-large" onClick={() => setShowAuthModal(true)}>
                        Jetzt kostenlos starten
                        <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <FileText size={20} />
                        <span>applyro</span>
                    </div>
                    <div className="footer-links">
                        <Link to="/impressum">Impressum</Link>
                        <Link to="/datenschutz">Datenschutz</Link>
                    </div>
                    <p>© 2026 <a href="https://elion-software.de" target="_blank" rel="noopener noreferrer">Elion Software</a>. Mit ❤️ erstellt.</p>
                </div>
            </footer>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowAuthModal(false)}>×</button>

                        <div className="auth-header">
                            <FileText size={32} />
                            <h2>{isSignUp ? 'Konto erstellen' : 'Willkommen zurück'}</h2>
                            <p>{isSignUp ? 'Starte jetzt kostenlos' : 'Melde dich an, um fortzufahren'}</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}
                        {success && <div className="auth-success">{success}</div>}

                        {/* OAuth Buttons */}
                        <div className="oauth-buttons">
                            <button className="oauth-btn google" onClick={handleGoogleAuth} disabled={loading}>
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Mit Google anmelden
                            </button>
                            <button className="oauth-btn github" onClick={handleGithubAuth} disabled={loading}>
                                <Github size={20} />
                                Mit GitHub anmelden
                            </button>
                        </div>

                        <div className="auth-divider">
                            <span>oder mit E-Mail</span>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">E-Mail</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="deine@email.de"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Passwort</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                {loading ? 'Laden...' : (isSignUp ? 'Konto erstellen' : 'Anmelden')}
                            </button>
                        </form>

                        <p className="auth-toggle">
                            {isSignUp ? 'Bereits ein Konto?' : 'Noch kein Konto?'}{' '}
                            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}>
                                {isSignUp ? 'Anmelden' : 'Registrieren'}
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
