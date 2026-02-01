import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiEye, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import styles from './projectDetails.module.css';
import Header from '../../components/header/header';
import LoadingSkeleton from '../../components/loading-skeleton/LoadingSkeleton';
import { getProjectById, incrementLikeCount, incrementViewCount, type Project } from '../../services/projectsService';

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            // Fetch project data
            const fetchedProject = await getProjectById(id);
            if (fetchedProject) {
                setProject(fetchedProject);
                // Increment view count in Firebase (fire and forget)
                incrementViewCount(id);
                // Increment local view count to reflect immediate change
                setProject(prev => prev ? ({ ...prev, views: prev.views + 1 }) : null);
            }
            setIsLoading(false);
        }

        fetchData();

        // Restore hasLiked state from localStorage if you want persistence across page reloads
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
        if (id && likedProjects[id]) {
            setHasLiked(true);
        }

    }, [id]);

    const handleLike = async () => {
        if (!hasLiked && project && id) {
            // Optimistic update
            setProject(prev => prev ? ({ ...prev, likes: prev.likes + 1 }) : null);
            setHasLiked(true);

            // Persist to localStorage
            const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
            likedProjects[id] = true;
            localStorage.setItem('likedProjects', JSON.stringify(likedProjects));

            // Update Firebase
            await incrementLikeCount(id);
        }
    };

    if (isLoading) {
        return (
            <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
                <LoadingSkeleton />
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div>
                    <h2>Projeto não encontrado</h2>
                    <button onClick={() => navigate(-1)} className={styles.backButton} style={{ marginTop: '20px' }}>
                        <FiArrowLeft /> Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
            <Header />
            <div className={styles.container}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <FiArrowLeft /> Voltar para Home
                </button>

                <header className={styles.header}>
                    <h1 className={styles.title}>{project.title}</h1>
                    <div className={styles.meta}>
                        <div className={styles.tags}>
                            {project.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                        <div className={styles.stats}>
                            <div
                                className={`${styles.statItem} ${hasLiked ? styles.liked : ''}`}
                                onClick={handleLike}
                                style={{ cursor: 'pointer' }}
                            >
                                <FiHeart fill={hasLiked ? "#e25555" : "none"} color={hasLiked ? "#e25555" : "currentColor"} />
                                {project.likes} Likes
                            </div>
                            <div className={styles.statItem}>
                                <FiEye /> {(project.views / 1000).toFixed(1)}k Views
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.heroImageContainer}>
                    <img src={project.imageUrl} alt={project.title} className={styles.heroImage} />
                </div>

                <div className={styles.contentGrid}>
                    <section className={styles.descriptionSection}>
                        <h2>Sobre o Projeto</h2>
                        <p className={styles.description}>{project.description}</p>
                    </section>

                    <aside className={styles.detailsSection}>
                        <h2>Funcionalidades</h2>
                        <ul className={styles.detailsList}>
                            {project.details.map((detail, index) => (
                                <li key={index} className={styles.detailItem}>
                                    <FiCheckCircle className={styles.detailIcon} />
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>

                <section className={styles.gallerySection}>
                    <h2>Galeria</h2>
                    <div className={styles.galleryGrid}>
                        {project.photos.map((photo, index) => (
                            <img key={index} src={photo} alt={`Galeria ${index + 1}`} className={styles.galleryImage} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
