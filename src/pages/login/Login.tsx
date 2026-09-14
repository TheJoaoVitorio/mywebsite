import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import styles from './login.module.css';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'signIn' | 'join'>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Mouse movement parallax effect for liquid chrome depth
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const rect = currentTarget.getBoundingClientRect();
        const x = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMouseOffset({ x, y });
    };

    const handleMouseLeave = () => {
        setMouseOffset({ x: 0, y: 0 });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/admin');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Credenciais inválidas. Verifique seu e-mail e senha.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Muitas tentativas sem sucesso. Aguarde alguns instantes.');
            } else {
                setError('Falha ao autenticar. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className={styles.container}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* 3D Liquid Chrome Ambient Background */}
            <div 
                className={styles.background} 
                style={{
                    transform: `translate3d(${mouseOffset.x * -14}px, ${mouseOffset.y * -14}px, 0) scale(1.03)`
                }}
            />

            {/* Dark Ambient Vignette & Depth */}
            <div className={styles.vignette} />

            {/* Liquid Glass Modal Card */}
            <div 
                className={styles.modalCard}
                style={{
                    transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 6}px, 0)`
                }}
            >
                {/* Top Right Close Button */}
                <button 
                    type="button" 
                    className={styles.closeButton} 
                    onClick={() => navigate('/')}
                    aria-label="Fechar e voltar à página inicial"
                >
                    <FiX />
                </button>

                {/* Header with Side-by-Side Tabs: Sign In / Join */}
                <div className={styles.tabHeader}>
                    <button
                        type="button"
                        className={`${styles.tabItem} ${activeTab === 'signIn' ? styles.tabItemActive : styles.tabItemInactive}`}
                        onClick={() => {
                            setActiveTab('signIn');
                            setError('');
                        }}
                    >
                        <span>Sign In</span>
                        {activeTab === 'signIn' ? (
                            <div className={styles.orangeIndicator} />
                        ) : (
                            <div className={styles.indicatorPlaceholder} />
                        )}
                    </button>

                    <button
                        type="button"
                        className={`${styles.tabItem} ${activeTab === 'join' ? styles.tabItemActive : styles.tabItemInactive}`}
                        onClick={() => {
                            setActiveTab('join');
                            setError('');
                        }}
                    >
                        <span>Join</span>
                        {activeTab === 'join' ? (
                            <div className={styles.orangeIndicator} />
                        ) : (
                            <div className={styles.indicatorPlaceholder} />
                        )}
                    </button>
                </div>

                {/* Inner Form Area */}
                <div className={styles.formContainer}>
                    {activeTab === 'join' ? (
                        <div className={styles.infoNotice}>
                            <p style={{ margin: '0 0 12px 0', color: '#ffffff', fontWeight: 500 }}>
                                Acesso Restrito
                            </p>
                            <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                O cadastro público de novas contas não está disponível. Esta área é restrita a administradores autorizados.
                            </p>
                            <button
                                type="button"
                                className={styles.submitButton}
                                style={{ marginTop: '20px' }}
                                onClick={() => setActiveTab('signIn')}
                            >
                                Voltar para o Sign In
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Error Notification */}
                            {error && (
                                <div className={styles.errorMessage}>
                                    {error}
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className={styles.formContainer} style={{ gap: '18px' }}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="email"
                                            id="email"
                                            className={styles.input}
                                            placeholder="hey@vino.costa"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="password" className={styles.label}>
                                        Password
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            className={`${styles.input} ${styles.inputWithIcon}`}
                                            placeholder="At least 12 symbols..."
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={styles.eyeButton}
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className={styles.submitButton} 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className={styles.spinner} />
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </button>

                                <div className={styles.portalBadge}>
                                    Admin Access Portal
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


