import { FiMapPin } from 'react-icons/fi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiFlutter, SiPython, SiReact, SiTypescript, SiNodedotjs, SiPostgresql } from 'react-icons/si';
import styles from './profileCard.module.css';

interface ProfileCardProps {
    avatarUrl?: string;
    name?: string;
    location?: string;
    linkedin?: string;
    enterprise?: string;
    studies?: string;
}

export default function ProfileCard({
    avatarUrl = "https://avatars.githubusercontent.com/u/141413107?v=4",
    name = "João Vitório",
    location = "Brasil",
    linkedin = "in/joão-vitório",
    enterprise = "Hotline Tecnologia",
    studies = "Uninter - ADS"
}: ProfileCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                <img src={avatarUrl} alt={name} className={styles.avatar} />
            </div>

            <div className={styles.names}>
                <span className={styles.displayName}>{name}</span>
                <span className={styles.username}>
                    <span className={styles.pronouns}>Software Developer</span>
                </span>
            </div>

            <div className={styles.actionButton}>
                <a href="mailto:joaovtr999x@gmail.com">
                    Contact Me
                </a>
            </div>

            <div className={styles.stats}>
                <span className={styles.statLink}>{enterprise}</span>
                <strong>·</strong>
                <span className={styles.statLink}>{studies}</span>
            </div>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <FiMapPin className={styles.detailIcon} />
                    <span>{location}</span>
                </div>
                <div className={styles.detailItem}>
                    <FaGithub className={styles.detailIcon} />
                    <a href="https://github.com/TheJoaoVitorio" target="_blank" rel="noopener noreferrer" className={styles.link}>
                        @TheJoaoVitorio
                    </a>
                </div>
                <div className={styles.detailItem}>
                    <FaLinkedin className={styles.detailIcon} />
                    <a href={`https://linkedin.com/${linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {linkedin}
                    </a>
                </div>
            </div>

            <div className={styles.achievements}>
                <h3 className={styles.achievementsTitle}>Stack & Technologies</h3>
                <div className={styles.techStack}>
                    <div className={styles.techIcon} title="Delphi">
                        <img src="/delphi-logo.png" alt='Delphi' className={styles.techIcon} />
                    </div>
                    <div className={styles.techIcon} title="Flutter">
                        <SiFlutter />
                    </div>
                    <div className={styles.techIcon} title="Python">
                        <SiPython />
                    </div>
                    <div className={styles.techIcon} title="React">
                        <SiReact />
                    </div>
                    <div className={styles.techIcon} title="TypeScript">
                        <SiTypescript />
                    </div>
                    <div className={styles.techIcon} title="Node.js">
                        <SiNodedotjs />
                    </div>
                    <div className={styles.techIcon} title="SQL">
                        <SiPostgresql />
                    </div>
                </div>
            </div>
        </div>
    );
}
