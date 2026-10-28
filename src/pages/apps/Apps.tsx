import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    FiChevronLeft,
    FiSmartphone,
    FiDownload,
    FiShare2,
    FiUser,
    FiCheck,
    FiGlobe
} from 'react-icons/fi';
import { FaWindows, FaApple, FaAndroid } from 'react-icons/fa';
import { subscribeToApps, type AppItem } from '../../services/appsService';
import styles from './apps.module.css';

export default function Apps() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [apps, setApps] = useState<AppItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToApps((fetchedApps) => {
            setApps(fetchedApps);
            setLoading(false);

            // Sync with URL param if present
            const appId = searchParams.get('app');
            if (appId) {
                const found = fetchedApps.find(a => a.id === appId);
                if (found) setSelectedApp(found);
            }
        });
        return () => unsubscribe();
    }, [searchParams]);

    // Handle view app
    const handleSelectApp = (app: AppItem) => {
        setSelectedApp(app);
        setSearchParams({ app: app.id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle back to listing
    const handleBackToList = () => {
        setSelectedApp(null);
        setSearchParams({});
    };

    // Share link
    const handleShare = async (app: AppItem) => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: app.name,
                    text: app.description,
                    url: shareUrl
                });
            } catch (err) {
                // Cancelled or unsupported
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Group apps by category (Image 1)
    const groupedApps = useMemo(() => {
        const groups: { [key: string]: AppItem[] } = {};
        apps.forEach((app) => {
            const cat = app.category && app.category.trim() ? app.category.trim() : 'Geral';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(app);
        });
        return groups;
    }, [apps]);

    // Resolved platforms array for current selected app
    const currentPlatforms = useMemo(() => {
        if (!selectedApp) return [];
        if (Array.isArray(selectedApp.platforms) && selectedApp.platforms.length > 0) {
            return selectedApp.platforms;
        }
        return ['Windows'];
    }, [selectedApp]);

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                {/* ── TOP BAR ── */}
                <div className={styles.topNav}>
                    {selectedApp ? (
                        <button className={styles.backBtn} onClick={handleBackToList}>
                            <FiChevronLeft size={22} />
                            <span>Apps</span>
                        </button>
                    ) : (
                        <button className={styles.backBtn} onClick={() => navigate('/')}>
                            <FiChevronLeft size={20} />
                            <span>Portfolio</span>
                        </button>
                    )}

                    <div className={styles.storeBadge}>
                        <FiSmartphone size={14} color="#2997ff" />
                        <span>App Store</span>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* ── DETAIL VIEW (Image 2 - Fiel ao App Store) ─────────── */}
                {/* ────────────────────────────────────────────────────────── */}
                {selectedApp ? (
                    <div className={styles.detailContainer}>
                        {/* Hero Card */}
                        <div className={styles.detailHeroCard}>
                            {selectedApp.bannerUrl && (
                                <img
                                    src={selectedApp.bannerUrl}
                                    alt={`${selectedApp.name} banner`}
                                    className={styles.detailBannerBg}
                                />
                            )}
                            <div className={styles.detailHeroOverlay} />

                            <div className={styles.detailAppIconWrapper}>
                                {selectedApp.iconUrl ? (
                                    <img
                                        src={selectedApp.iconUrl}
                                        alt={selectedApp.name}
                                        className={styles.detailAppIcon}
                                    />
                                ) : (
                                    <FiSmartphone size={48} color="#2997ff" />
                                )}
                            </div>

                            <div className={styles.detailHeroInfo}>
                                <h1 className={styles.detailTitle}>{selectedApp.name}</h1>
                                <p className={styles.detailSubtitle}>
                                    {selectedApp.category || 'Aplicativo'} • {currentPlatforms.join(', ')}
                                </p>
                                <span className={styles.detailMetaText}>
                                    Grátis • Desenvolvido por {selectedApp.developer || 'João Vitório'}
                                </span>

                                <div className={styles.detailActionRow}>
                                    {selectedApp.downloadUrl ? (
                                        <a
                                            href={selectedApp.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.primaryDownloadBtn}
                                        >
                                            <FiDownload size={16} />
                                            <span>Baixar</span>
                                        </a>
                                    ) : (
                                        <span className={styles.primaryDownloadBtn} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                            Indisponível
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        className={styles.shareBtn}
                                        onClick={() => handleShare(selectedApp)}
                                        title="Compartilhar aplicativo"
                                    >
                                        {copied ? <FiCheck size={14} color="#34d399" /> : <FiShare2 size={14} />}
                                        <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Metrics / Stats Bar (Image 2) */}
                        <div className={styles.statsBar}>
                            <div className={styles.statColumn}>
                                <span className={styles.statLabel}>Avaliações</span>
                                <span className={styles.statMain}>5,0 ★</span>
                                <span className={styles.statSub}>Recomendado</span>
                            </div>

                            <div className={styles.statColumn}>
                                <span className={styles.statLabel}>Idade</span>
                                <span className={styles.statMain}>
                                    <span className={styles.ageBadge}>L</span>
                                </span>
                                <span className={styles.statSub}>Livre</span>
                            </div>

                            <div className={styles.statColumn}>
                                <span className={styles.statLabel}>Categoria</span>
                                <span className={styles.statMain}>{selectedApp.category || 'App'}</span>
                                <span className={styles.statSub}>Software</span>
                            </div>

                            <div className={styles.statColumn}>
                                <span className={styles.statLabel}>Desenvolvedor</span>
                                <span className={styles.statMain}>
                                    <FiUser size={18} />
                                </span>
                                <span className={styles.statSub}>{selectedApp.developer || 'João Vitório'}</span>
                            </div>

                            <div className={styles.statColumn}>
                                <span className={styles.statLabel}>Idioma</span>
                                <span className={styles.statMain}>PT</span>
                                <span className={styles.statSub}>+ EN</span>
                            </div>

                            <div className={styles.statColumn}>
                                <span className={styles.statLabel}>Tamanho</span>
                                <span className={styles.statMain}>{selectedApp.fileSize || 'N/A'}</span>
                                <span className={styles.statSub}>Download</span>
                            </div>
                        </div>

                        {/* Compatibility Bar with Platforms */}
                        <div className={styles.compatibilityBar}>
                            <div className={styles.devicesIcons}>
                                {currentPlatforms.includes('Windows') && <FaWindows size={15} title="Windows" />}
                                {currentPlatforms.includes('macOS') && <FaApple size={16} title="macOS" />}
                                {currentPlatforms.includes('Android') && <FaAndroid size={16} title="Android" />}
                                {currentPlatforms.includes('Web') && <FiGlobe size={15} title="Web" />}
                            </div>
                            <span>Disponível para {currentPlatforms.join(', ')}</span>
                        </div>

                        {/* Description Section */}
                        <div className={styles.descriptionSection}>
                            <h2 className={styles.descriptionTitle}>Descrição</h2>
                            <p className={styles.descriptionBody}>
                                {selectedApp.description || 'Nenhuma descrição detalhada informada.'}
                            </p>
                        </div>

                        {/* Bottom CTA */}
                        {selectedApp.downloadUrl && (
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <a
                                    href={selectedApp.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.primaryDownloadBtn}
                                    style={{ padding: '12px 36px', fontSize: 16 }}
                                >
                                    <FiDownload size={18} />
                                    <span>Baixar {selectedApp.name} ({selectedApp.fileSize || 'Grátis'})</span>
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ────────────────────────────────────────────────────────── */
                    /* ── LISTING VIEW (Image 1 - Fiel ao App Store) ────────── */
                    /* ────────────────────────────────────────────────────────── */
                    <div>
                        {loading ? (
                            <div className={styles.emptyState}>Carregando aplicativos da App Store...</div>
                        ) : Object.keys(groupedApps).length > 0 ? (
                            Object.entries(groupedApps).map(([category, categoryApps]) => (
                                <section key={category} className={styles.categorySection}>
                                    <h2 className={styles.categoryTitle}>
                                        <span>{category}</span>
                                        <span className={styles.chevron}>›</span>
                                    </h2>

                                    <div className={styles.appsGrid}>
                                        {categoryApps.map((app) => (
                                            <div
                                                key={app.id}
                                                className={styles.appRowItem}
                                                onClick={() => handleSelectApp(app)}
                                            >
                                                {app.iconUrl ? (
                                                    <img
                                                        src={app.iconUrl}
                                                        alt={app.name}
                                                        className={styles.appRowIcon}
                                                    />
                                                ) : (
                                                    <div className={styles.appRowFallbackIcon}>
                                                        <FiSmartphone size={24} />
                                                    </div>
                                                )}

                                                <div className={styles.appRowInfo}>
                                                    <h3 className={styles.appRowName} title={app.name}>
                                                        {app.name}
                                                    </h3>
                                                    <span className={styles.appRowSubtitle}>
                                                        {app.description || app.fileSize || 'Disponível para download'}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={styles.visualizarBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectApp(app);
                                                    }}
                                                >
                                                    Visualizar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p style={{ margin: '0 0 10px 0', fontSize: 18, color: '#fff', fontWeight: 600 }}>Nenhum aplicativo cadastrado</p>
                                <p style={{ margin: 0 }}>Acesse o painel de administração em <strong>/admin</strong> para cadastrar seus aplicativos e softwares.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
