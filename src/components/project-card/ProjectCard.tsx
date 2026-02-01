import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye } from 'react-icons/fi';
import styles from './projectCard.module.css';

interface ProjectCardProps {
    id: string | number;
    title: string;
    imageUrl: string;
    likes: number;
    views: number;
}

export default function ProjectCard({ id, title, imageUrl, likes, views }: ProjectCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${id}`);
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.gradientOverlay} />
            <img
                src={imageUrl}
                alt={title}
                className={styles.image}
            />

            <div className={styles.content}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.stats}>
                    <span className={styles.statItem}>
                        <FiHeart size={12} fill="currentColor" /> {likes}
                    </span>
                    <span className={styles.statItem}>
                        <FiEye size={12} /> {views}
                    </span>
                </div>
            </div>
        </div>
    );
}
