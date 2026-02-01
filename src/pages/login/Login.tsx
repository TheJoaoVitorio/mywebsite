import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig'; // Ensure this path is correct
import styles from './login.module.css';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err: any) {
            console.error(err);
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                {/* Left Side - Form */}
                <div className={styles.formSection}>
                    <div className={styles.brand}>
                        <div className={styles.logoIcon}></div>
                        <span>Auth</span>
                    </div>

                    <h1 className={styles.title}>Login to your account</h1>
                    <p className={styles.subtitle}>Use a verification code or your password to continue.</p>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <FiMail className={styles.inputIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <div className={styles.inputWrapper}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.input}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.forgotPassword}>Forgot password?</div>

                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'} <FiArrowRight />
                        </button>
                    </form>

                    <div className={styles.footer}>
                        Need help? Contact <a href="#" className={styles.link}>support@mysite.com</a>
                    </div>
                </div>

                {/* Right Side - Visual */}
                <div className={styles.visualSection}>
                    <div className={styles.visualBrand}>
                        <div className={styles.logoIcon}></div>
                        <span>Administration</span>
                    </div>

                    <div className={styles.sphere}></div>

                    <div className={styles.visualContent}>
                        <h2 className={styles.visualTitle}>Powerful and easy client dashboards</h2>
                        <p className={styles.visualText}>
                            Track orders, projects, and billing in one secure portal built for growth.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
