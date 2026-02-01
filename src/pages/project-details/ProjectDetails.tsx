import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiEye, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import styles from './projectDetails.module.css';
import Header from '../../components/header/header';
import LoadingSkeleton from '../../components/loading-skeleton/LoadingSkeleton';

// Mock data (extended)
const mockProjectData = {
    id: 1,
    title: "E-Commerce Fullstack",
    description: `Uma plataforma completa de comércio eletrônico projetada para oferecer a melhor experiência de usuário e facilidade de gestão para os administradores. 

    O sistema conta com gestão de inventário em tempo real, processamento de pagamentos seguro via Stripe, e um painel administrativo intuitivo para acompanhamento de métricas de vendas. A interface foi construída seguindo os princípios de Design Atômico para garantir consistência e manutenibilidade.`,
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    likes: 342,
    views: 1205,
    details: [
        "Autenticação segura de usuários com JWT",
        "Integração com gateway de pagamento Stripe",
        "Upload e otimização de imagens na nuvem",
        "Dashboard analítico para administradores",
        "Design responsivo para mobile e desktop"
    ],
    photos: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
};

export default function ProjectDetails() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState(mockProjectData);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        // Simulate fetching data and view increment
        const timer = setTimeout(() => {
            setProject(prev => ({
                ...prev,
                views: prev.views + 1
            }));
            setIsLoading(false);
        }, 1500); // 1.5s skeleton duration

        return () => clearTimeout(timer);
    }, []);

    const handleLike = () => {
        if (!hasLiked) {
            setProject(prev => ({
                ...prev,
                likes: prev.likes + 1
            }));
            setHasLiked(true);
        }
    };

    if (isLoading) {
        return (
            <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
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
