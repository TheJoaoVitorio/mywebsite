import styles from './loadingSkeleton.module.css';

export default function LoadingSkeleton() {
    return (
        <div className={styles.skeletonContainer}>
            <div className={styles.skeletonHeader}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonMeta}>
                    <div className={styles.skeletonTag} />
                    <div className={styles.skeletonTag} />
                    <div className={styles.skeletonTag} />
                </div>
            </div>
            <div className={styles.skeletonHero} />
            <div className={styles.skeletonContent}>
                <div>
                    <div className={styles.skeletonText} style={{ width: '90%' }} />
                    <div className={styles.skeletonText} style={{ width: '95%' }} />
                    <div className={styles.skeletonText} style={{ width: '85%' }} />
                    <div className={styles.skeletonText} style={{ width: '60%' }} />
                </div>
                <div className={styles.skeletonAside} />
            </div>
        </div>
    );
}
