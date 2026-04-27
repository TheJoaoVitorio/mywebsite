import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLayers } from 'react-icons/fi';
import { subscribeToTools, type ToolItem } from '../../services/toolsService';
import styles from './Utils.module.css';

export default function Utils() {
    const navigate = useNavigate();
    const [tools, setTools] = useState<ToolItem[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToTools((fetchedTools) => {
            setTools(fetchedTools);
        });
        return () => unsubscribe();
    }, []);

    const goBack = () => {
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={goBack}>
                <FiArrowLeft size={20} />
                <span>Back to Portfolio</span>
            </button>

            <header className={styles.header}>
                <div className={styles.logoGroup}>
                    <FiLayers className={styles.logoIcon} />
                    <span className={styles.logoText}>Tools</span>
                </div>
                
                <p className={styles.subtitle}>
                    A collection of custom tools and mini-apps<br />
                    I've built to speed up my daily workflow.
                </p>
            </header>

            <div className={styles.bentoGrid}>
                {tools.length > 0 ? tools.map(tool => (
                    <a 
                        key={tool.id}
                        href={tool.link || '#'} 
                        onClick={(event) => {
                            if (tool.link && tool.link.startsWith('/')) {
                                event.preventDefault();
                                navigate(tool.link);
                            }
                        }}
                        target={tool.link && tool.link.startsWith('http') ? "_blank" : undefined}
                        rel={tool.link && tool.link.startsWith('http') ? "noopener noreferrer" : undefined}
                        style={{ 
                            '--span-desktop': tool.spanDesktop,
                            '--span-tablet': tool.spanTablet,
                            '--span-mobile': tool.spanMobile,
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'block'
                        } as React.CSSProperties}
                        className={`wrapper-link-${tool.id}`}
                    >
                        <style>{`
                            .wrapper-link-${tool.id} {
                                grid-column: span var(--span-desktop);
                            }
                            .wrapper-${tool.id} {
                                border-radius: 28px;
                                overflow: hidden;
                                transition: transform 0.2s, box-shadow 0.2s;
                                height: 100%;
                            }
                            .wrapper-${tool.id}:hover {
                                transform: scale(0.98);
                            }
                            @media (max-width: 1024px) {
                                .wrapper-link-${tool.id} {
                                    grid-column: span var(--span-tablet);
                                }
                            }
                            @media (max-width: 768px) {
                                .wrapper-link-${tool.id} {
                                    grid-column: span var(--span-mobile) !important;
                                    grid-row: auto !important;
                                }
                            }

                            /* Injected Custom CSS from Admin Panel */
                            ${tool.css}
                        `}</style>
                        <div 
                            className={`wrapper-${tool.id}`} 
                            dangerouslySetInnerHTML={{ __html: tool.html }} 
                        />
                    </a>
                )) : (
                    <div style={{gridColumn: 'span 12', textAlign: 'center', color: '#888', marginTop: 40}}>
                        <p>No tools configured yet. Add them in the Admin Panel!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
