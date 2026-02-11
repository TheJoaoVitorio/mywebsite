import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { getProjects, addProject, updateProject, deleteProject, type Project } from '../../services/projectsService';
import styles from './admin.module.css';
import { FiHome, FiBox, FiLogOut, FiPlus, FiTrash2, FiSave, FiArrowLeft } from 'react-icons/fi';
import ImageModal from '../../components/image-modal/ImageModal';

export default function Admin() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [refresh, setRefresh] = useState(0); // Trigger fetch

    // UI State
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        tags: '',
        details: '',
        photos: ''
    });

    useEffect(() => {
        async function fetch() {
            const data = await getProjects();
            setProjects(data);
        }
        fetch();
    }, [refresh]);

    const openModal = (url: string) => {
        setSelectedImage(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleNewProject = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            tags: '',
            details: '',
            photos: ''
        });
        setView('edit');
    };

    const handleEditProject = (project: Project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            tags: project.tags.join(', '),
            details: project.details.join('\n'),
            photos: project.photos.join('\n')
        });
        setView('edit');
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const projectData = {
                title: formData.title,
                description: formData.description,
                imageUrl: formData.imageUrl,
                tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
                details: formData.details.split('\n').filter(Boolean),
                photos: formData.photos.split('\n').filter(Boolean)
            };

            if (editingId) {
                await updateProject(editingId, projectData);
            } else {
                await addProject(projectData);
            }

            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            console.error("Failed to save", error);
            alert("Erro ao salvar projeto");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editingId) return;
        if (!confirm("Tem certeza que deseja apagar este projeto?")) return;

        setLoading(true);
        try {
            await deleteProject(editingId);
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Erro ao deletar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}></div>
                    <span>Admin Panel</span>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.navItem} onClick={() => navigate('/')}>
                        <FiHome className={styles.navIcon} /> Go to Site
                    </div>
                    <div className={`${styles.navItem} ${styles.navItemActive}`}>
                        <FiBox className={styles.navIcon} /> Projects
                    </div>
                </nav>

                <button className={styles.logoutButton} onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {view === 'list' ? (
                    <>
                        {/* Header */}
                        <header className={styles.pageHeader}>
                            <div className={styles.pageTitle}>
                                <h1>Projects</h1>
                                <p>Manage and organize your portfolio projects.</p>
                            </div>
                            <button className={styles.primaryButton} onClick={handleNewProject}>
                                <FiPlus /> New Project
                            </button>
                        </header>

                        {/* Projects Grid */}
                        <div className={styles.projectsGrid}>
                            {projects.map(p => (
                                <div key={p.id} className={styles.projectCard} onClick={() => handleEditProject(p)}>
                                    <div className={styles.cardImageContainer}>
                                        <img src={p.imageUrl || 'https://via.placeholder.com/300x150?text=No+Image'} alt={p.title} className={styles.cardImage} />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{p.title}</h3>
                                        <div className={styles.cardMeta}>
                                            <span>{p.tags[0] || 'No tag'}</span>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <span>{p.likes} likes</span>
                                                <span>{p.views} views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles.formContainer}>
                        <header className={styles.pageHeader} style={{ borderBottom: 'none', marginBottom: 20 }}>
                            <div className={styles.pageTitle}>
                                <button className={styles.secondaryButton} onClick={() => setView('list')} style={{ marginBottom: 16 }}>
                                    <FiArrowLeft /> Back to List
                                </button>
                                <h1>{editingId ? 'Edit Project' : 'Create New Project'}</h1>
                            </div>
                            <div className={styles.actions} style={{ display: 'flex', gap: 12 }}>
                                {editingId && (
                                    <button className={styles.dangerButton} onClick={handleDelete} disabled={loading}>
                                        <FiTrash2 /> Delete
                                    </button>
                                )}
                                <button className={styles.primaryButton} onClick={handleSave} disabled={loading}>
                                    <FiSave />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </header>

                        {/* Top Info Box */}
                        <div className={styles.infoBox}>
                            <div style={{ marginTop: 2 }}>ℹ️</div>
                            <div>
                                <strong>Project Details</strong><br />
                                Fill in all the information to ensure the project page looks great. Use high-quality images for the best results.
                            </div>
                        </div>

                        {/* 1. Basic Information */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>1</div>
                                <div className={styles.sectionTitle}>Basic Information</div>
                            </div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Project Title</label>
                                    <input
                                        className={styles.input}
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Finance Dashboard"
                                    />
                                </div>
                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>Description</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the main purpose and features..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Visuals */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>2</div>
                                <div className={styles.sectionTitle}>Visuals & Media</div>
                            </div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Cover Image URL</label>
                                    <input
                                        className={styles.input}
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                {formData.imageUrl && (
                                    <div style={{ marginBottom: 20, borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                                            onClick={() => openModal(formData.imageUrl)}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Invalid+Image+URL';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>Gallery Images (One URL per line)</label>
                                    <textarea
                                        className={styles.textarea}
                                        style={{ minHeight: '100px' }}
                                        value={formData.photos}
                                        onChange={e => setFormData({ ...formData, photos: e.target.value })}
                                        placeholder={"https://img1.com\nhttps://img2.com"}
                                    />
                                </div>
                                {formData.photos && (
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                        {formData.photos.split('\n').map(s => s.trim()).filter(Boolean).map((url, index) => (
                                            <div key={index} style={{ width: '100px', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #333' }}>
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                    onClick={() => openModal(url)}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Invalid';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Configuration */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>3</div>
                                <div className={styles.sectionTitle}>Configuration</div>
                            </div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Tags (Comma separated)</label>
                                    <input
                                        className={styles.input}
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="React, TypeScript, UI/UX"
                                    />
                                </div>
                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>Features List (One per line)</label>
                                    <textarea
                                        className={styles.textarea}
                                        style={{ minHeight: '100px' }}
                                        value={formData.details}
                                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                                        placeholder={"Dark Mode\nResponsive Layout\nReal-time Data"}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>

            <ImageModal
                isOpen={isModalOpen}
                imageUrl={selectedImage}
                onClose={closeModal}
            />
        </div>
    );
}
