import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import styles from './login.module.css';
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            if (
                err.code === 'auth/invalid-credential' ||
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/user-not-found'
            ) {
                setError('Credenciais inválidas. Verifique seu e-mail e senha.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Muitas tentativas sem sucesso. Aguarde alguns instantes.');
            } else {
                setError('Falha ao autenticar. Verifique suas credenciais.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Atmospheric dark blue glows from design system */}
            <div className={styles.ambientGlowLeft} />
            <div className={styles.ambientGlowBottom} />
            <div className={styles.subtleVignette} />

            {/* Split Modal Card */}
            <div className={`${styles.card} animate-item-scale stagger-1`}>
                {/* Left Column: Horizon Drift banner with Auth title & Admin restriction notice */}
                <div className={`${styles.bannerColumn} animate-item-left stagger-2`}>
                    <img
                        src="/horizon-drift.jpg"
                        alt="Horizon Drift"
                        className={styles.bannerImage}
                    />
                    <div className={styles.bannerOverlay} />

                    <div className={styles.bannerContent}>
                        <h2 className={styles.authTitle}>Auth</h2>
                        <p className={styles.authSubtitle}>
                            Restricted access. Only authorized administrators are permitted to enter this area.
                        </p>
                    </div>
                </div>

                {/* Right Column: Form Section */}
                <div className={`${styles.formColumn} animate-item stagger-2`}>
                    {/* Back to site arrow */}
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate('/')}
                        aria-label="Voltar para a página inicial"
                    >
                        <FiArrowLeft />
                    </button>

                    {/* Header */}
                    <div className={styles.header}>
                        <h1 className={styles.title}>Log in</h1>
                        <p className={styles.subtitle}>
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Email Field with Label */}
                        <div className={styles.fieldGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email Address
                            </label>
                            <div className={styles.inputWrapper}>
                                <FiMail className={styles.leftIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field with Label */}
                        <div className={styles.fieldGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                            <div className={styles.inputWrapper}>
                                <FiLock className={styles.leftIcon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className={`${styles.input} ${styles.inputPassword}`}
                                    placeholder="Enter your password"
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
                                    {showPassword ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Pill Button */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? <span className={styles.spinner} /> : 'Log in'}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className={styles.footer}>
                        <span>Didn’t have an account?</span>
                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/');
                            }}
                            className={styles.signupLink}
                        >
                            Back to site
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
