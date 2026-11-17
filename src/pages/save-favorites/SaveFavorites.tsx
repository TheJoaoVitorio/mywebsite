import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiBookmark, FiExternalLink, FiGlobe } from 'react-icons/fi';
import {
    subscribeToFavorites,
    getHostname,
    collectCategories,
    type FavoriteItem
} from '../../services/favoritesService';
import styles from './saveFavorites.module.css';

const VIEWPORT_W = 1280;
const VIEWPORT_H = 800;

/** Lazy site preview: renders only when near the viewport, scaled to fit the card. */
function SitePreview({ item }: { item: FavoriteItem }) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [scale, setScale] = useState(0.25);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                io.disconnect();
            }
        }, { rootMargin: '200px' });
        io.observe(el);
        const ro = new ResizeObserver(([entry]) => {
            setScale(entry.contentRect.width / VIEWPORT_W);
        });
        ro.observe(el);
        return () => { io.disconnect(); ro.disconnect(); };
    }, []);

    const screenshotSrc = `https://image.thum.io/get/width/1200/crop/750/${item.url}`;

    return (
        <div ref={boxRef} className={styles.preview}>
            <div className={styles.previewFallback}>
                <FiGlobe size={28} />
                <span>{getHostname(item.url)}</span>
            </div>

            {visible && item.previewMode === 'live' && (
                <iframe
                    src={item.url}
                    title={item.title}
                    loading="lazy"
                    tabIndex={-1}
                    sandbox="allow-scripts allow-same-origin"
                    referrerPolicy="no-referrer"
                    className={`${styles.previewFrame} ${loaded ? styles.previewLoaded : ''}`}
                    style={{ width: VIEWPORT_W, height: VIEWPORT_H, transform: `scale(${scale})` }}
                    onLoad={() => setLoaded(true)}
                />
            )}

            {visible && item.previewMode === 'screenshot' && (
                <img
                    src={screenshotSrc}
                    alt={item.title}
                    loading="lazy"
                    className={`${styles.previewImage} ${loaded ? styles.previewLoaded : ''}`}
                    onLoad={() => setLoaded(true)}
                />
            )}
        </div>
    );
}

function FavoriteCard({ item, index, carousel }: { item: FavoriteItem; index: number; carousel?: boolean }) {
    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.card} ${carousel ? styles.carouselCard : ''} stagger-grid-item`}
            style={{ '--item-i': index } as React.CSSProperties}
        >
            {item.previewMode !== 'none' ? (
                <SitePreview item={item} />
            ) : (
                <div className={styles.preview}>
                    <div className={styles.previewFallback}>
                        <FiGlobe size={28} />
                        <span>{getHostname(item.url)}</span>
                    </div>
                </div>
            )}
            <div className={styles.cardInfo}>
                <div className={styles.cardText}>
                    <h3 className={styles.cardTitle} title={item.title}>{item.title}</h3>
                    <span className={styles.cardSub}>
                        {item.description || getHostname(item.url)}
                    </span>
                </div>
                <span className={styles.openBtn} aria-hidden="true">
                    <FiExternalLink size={14} />
                </span>
            </div>
        </a>
    );
}

/** Apple-style horizontal carousel with prev/next buttons. */
function Carousel({ list }: { list: FavoriteItem[] }) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = () => {
        const el = scrollerRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    useEffect(() => {
        update();
        const el = scrollerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [list.length]);

    const scrollByPage = (dir: 1 | -1) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
    };

    return (
        <div className={styles.carouselWrap}>
            <div ref={scrollerRef} className={styles.carousel} onScroll={update}>
                {list.map((item, index) => (
                    <FavoriteCard key={item.id} item={item} index={index} carousel />
                ))}
            </div>
            <button
                type="button"
                aria-label="Anterior"
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={() => scrollByPage(-1)}
                disabled={!canPrev}
            >
                <FiChevronLeft size={20} />
            </button>
            <button
                type="button"
                aria-label="Próximo"
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={() => scrollByPage(1)}
                disabled={!canNext}
            >
                <FiChevronRight size={20} />
            </button>
        </div>
    );
}

export default function SaveFavorites() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);

    const selectedCategory = searchParams.get('categoria');

    useEffect(() => {
        const unsubscribe = subscribeToFavorites((fetched) => {
            setItems(fetched);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const grouped = useMemo(() => {
        return collectCategories(items)
            .map(type => ({ type, list: items.filter(i => i.type === type) }))
            .filter(g => g.list.length > 0);
    }, [items]);

    const selectedGroup = selectedCategory ? grouped.find(g => g.type === selectedCategory) : undefined;

    const openCategory = (type: string) => {
        setSearchParams({ categoria: type });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={`${styles.topNav} animate-item stagger-1`}>
                    {selectedCategory ? (
                        <button className={styles.backBtn} onClick={() => setSearchParams({})}>
                            <FiChevronLeft size={22} />
                            <span>Favoritos</span>
                        </button>
                    ) : (
                        <button className={styles.backBtn} onClick={() => navigate('/')}>
                            <FiChevronLeft size={20} />
                            <span>Portfolio</span>
                        </button>
                    )}
                    <div className={styles.badge}>
                        <FiBookmark size={14} style={{ color: 'var(--accent-primary)' }} />
                        <span>{selectedCategory ?? 'Save Favorites'}</span>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.emptyState}>Carregando favoritos...</div>
                ) : selectedCategory ? (
                    /* ── CATEGORY VIEW: all items of one category ── */
                    selectedGroup ? (
                        <section key={selectedCategory} className={`${styles.section} animate-item stagger-2`}>
                            <h2 className={styles.sectionTitle}>
                                <span>{selectedGroup.type}</span>
                                <span className={styles.count}>{selectedGroup.list.length}</span>
                            </h2>
                            <div className={styles.grid}>
                                {selectedGroup.list.map((item, index) => (
                                    <FavoriteCard key={item.id} item={item} index={index} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <div className={`${styles.emptyState} animate-item stagger-2`}>
                            Nenhum item na categoria "{selectedCategory}".
                        </div>
                    )
                ) : grouped.length > 0 ? (
                    /* ── DEFAULT VIEW: one carousel per category ── */
                    grouped.map(({ type, list }) => (
                        <section key={type} className={`${styles.section} animate-item stagger-2`}>
                            <h2 className={styles.sectionTitle}>
                                <button
                                    type="button"
                                    className={styles.sectionLink}
                                    onClick={() => openCategory(type)}
                                    title={`Ver todos de ${type}`}
                                >
                                    <span>{type}</span>
                                    <span className={styles.chevron}>›</span>
                                </button>
                                <span className={styles.count}>{list.length}</span>
                            </h2>
                            <Carousel list={list} />
                        </section>
                    ))
                ) : (
                    <div className={`${styles.emptyState} animate-item stagger-2`}>
                        <p style={{ margin: '0 0 10px 0', fontSize: 18, color: 'var(--text-primary)', fontWeight: 600 }}>Nenhum item salvo</p>
                        <p style={{ margin: 0 }}>Acesse <strong>/admin</strong> para cadastrar Favoritos, Skills e UI.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
