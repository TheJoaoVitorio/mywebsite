import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { getProjects, addProject, updateProject, deleteProject, type Project } from '../../services/projectsService';
import { getTools, addTool, updateTool, deleteTool, type ToolItem } from '../../services/toolsService';
import { getApps, addApp, updateApp, deleteApp, type AppItem } from '../../services/appsService';
import styles from './admin.module.css';
import { FiHome, FiBox, FiLogOut, FiPlus, FiTrash2, FiSave, FiArrowLeft, FiUpload, FiLink, FiLayers, FiCode, FiEye, FiX, FiSmartphone, FiGlobe } from 'react-icons/fi';
import { FaWindows, FaApple, FaAndroid } from 'react-icons/fa';
import ImageModal from '../../components/image-modal/ImageModal';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const TEMPLATES = {
    Pricing: {
        css: `.card-pricing {\n  background: linear-gradient(135deg, #f3d1d8 0%, #b8c1ec 100%);\n  padding: 30px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.card-pricing h3 {\n  color: #ffffff;\n  font-size: 20px;\n  font-weight: 500;\n  margin: 0 0 4px 0;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.card-pricing p {\n  color: rgba(255,255,255,0.8);\n  font-size: 14px;\n  margin: 0 0 20px 0;\n}\n.mock-input {\n  background: rgba(0,0,0,0.4);\n  backdrop-filter: blur(10px);\n  border-radius: 20px;\n  padding: 12px 20px;\n  font-size: 13px;\n  color: rgba(255,255,255,0.6);\n}`,
        html: `<div class="card-pricing">\n  <h3>Pricing Calculator</h3>\n  <p>Calculate freelance hours</p>\n  <div class="mock-input">\n    Enter project scope... |\n  </div>\n</div>`,
        spanDesktop: 3, spanTablet: 3, spanMobile: 1
    },
    DarkSmall: {
        css: `.card-dark {\n  background-color: #161819;\n  border: 1px solid rgba(255, 255, 255, 0.03);\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n}\n.icon-3d {\n  width: 60px;\n  height: 60px;\n  border-radius: 16px;\n  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.0));\n  box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 10px 20px rgba(0,0,0,0.5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  transform: perspective(400px) rotateX(10deg) rotateY(-10deg);\n  font-size: 24px;\n  color: #58a6ff;\n}\n.card-dark span {\n  font-size: 16px;\n  font-weight: 500;\n  color: #c9d1d9;\n}`,
        html: `<div class="card-dark">\n  <div class="icon-3d">🔒</div>\n  <span>Password Gen</span>\n</div>`,
        spanDesktop: 2, spanTablet: 3, spanMobile: 1
    },
    SilverWide: {
        css: `.card-silver {\n  background: linear-gradient(to right, #d4dbdf 0%, #aebac1 100%);\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.card-silver h3 {\n  color: #1e2326;\n  font-size: 24px;\n  font-weight: 600;\n  margin: 0;\n}\n.brand-gradient {\n  background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
        html: `<div class="card-silver">\n  <h3>Extract colors with <span class="brand-gradient">AI</span></h3>\n</div>`,
        spanDesktop: 5, spanTablet: 6, spanMobile: 1
    },
    LargeDashboard: {
        css: `.card-large {\n  background: linear-gradient(135deg, #1c1d1f 0%, #511c3e 100%);\n  padding: 50px;\n  height: 100%;\n  box-sizing: border-box;\n}\n.card-large h2 {\n  color: #8b949e;\n  font-size: 40px;\n  font-weight: 500;\n  line-height: 1.1;\n  margin: 0 0 30px 0;\n}\n.card-large h2 span {\n  color: #ffffff;\n}\n.pill-group {\n  display: flex;\n  gap: 12px;\n}\n.pill {\n  background: rgba(255, 255, 255, 0.1);\n  padding: 8px 16px;\n  border-radius: 20px;\n  font-size: 14px;\n  color: #c9d1d9;\n}`,
        html: `<div class="card-large">\n  <h2>Discover<br/><span>opportunities the<br/>moment they launch</span></h2>\n  <div class="pill-group">\n    <span class="pill">Dashboard</span>\n    <span class="pill">Analytics</span>\n  </div>\n</div>`,
        spanDesktop: 8, spanTablet: 6, spanMobile: 1
    },
    GreenRegex: {
        css: `.card-regex {\n  background: linear-gradient(135deg, #9ae1a0 0%, #6bc18e 100%);\n  padding: 40px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 30px;\n  box-sizing: border-box;\n}\n.toggle-group {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.toggle-track {\n  width: 80px;\n  height: 36px;\n  background: rgba(255,255,255,0.5);\n  border-radius: 18px;\n  position: relative;\n}\n.toggle-thumb {\n  width: 28px;\n  height: 28px;\n  background: #ffffff;\n  border-radius: 50%;\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n}\n.multiplier {\n  color: #1e2326;\n  font-size: 20px;\n  font-weight: 500;\n}\n.card-label-dark {\n  color: #1e2326;\n  font-size: 18px;\n  font-weight: 500;\n}`,
        html: `<div class="card-regex">\n  <div class="toggle-group">\n    <div class="toggle-track"><div class="toggle-thumb"></div></div>\n    <span class="multiplier">Regex</span>\n  </div>\n  <span class="card-label-dark">Test and match any pattern</span>\n</div>`,
        spanDesktop: 4, spanTablet: 3, spanMobile: 1
    }
};

export default function Admin() {
    const navigate = useNavigate();

    // Tab State
    const [activeTab, setActiveTab] = useState<'projects' | 'tools' | 'apps'>('projects');
    const [view, setView] = useState<'list' | 'edit'>('list');

    // Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [tools, setTools] = useState<ToolItem[]>([]);
    const [apps, setApps] = useState<AppItem[]>([]);
    const [refresh, setRefresh] = useState(0);

    // Global UI State
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    // Projects Form State
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        tags: [] as string[],
        details: [] as string[],
        photos: [] as string[]
    });

    // Tag and Feature input state
    const [tagInput, setTagInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [galleryUrlInput, setGalleryUrlInput] = useState('');

    // Tools Form State
    const [editingToolId, setEditingToolId] = useState<string | null>(null);
    const [toolForm, setToolForm] = useState({
        title: '',
        link: '',
        html: '',
        css: '',
        spanDesktop: 3,
        spanTablet: 6,
        spanMobile: 1,
        order: 0
    });

    // Apps Form State
    const [editingAppId, setEditingAppId] = useState<string | null>(null);
    const [appForm, setAppForm] = useState({
        name: '',
        iconUrl: '',
        description: '',
        category: '',
        bannerUrl: '',
        fileSize: '',
        downloadUrl: '',
        version: '1.0.0',
        developer: 'João Vitório',
        platforms: ['Windows'] as string[],
        screenshots: [] as string[],
        order: 0
    });

    useEffect(() => {
        async function fetchData() {
            if (activeTab === 'projects') {
                const data = await getProjects();
                setProjects(data);
            } else if (activeTab === 'tools') {
                const data = await getTools();
                setTools(data);
            } else if (activeTab === 'apps') {
                const data = await getApps();
                setApps(data);
            }
        }
        fetchData();
    }, [refresh, activeTab]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery' | 'appIcon' | 'appBanner' | 'appScreenshots') => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        try {
            if (type === 'cover') {
                const file = e.target.files[0];
                const secureUrl = await uploadToCloudinary(file);
                setProjectForm(prev => ({ ...prev, imageUrl: secureUrl }));
            } else if (type === 'appIcon') {
                const file = e.target.files[0];
                const secureUrl = await uploadToCloudinary(file);
                setAppForm(prev => ({ ...prev, iconUrl: secureUrl }));
            } else if (type === 'appBanner') {
                const file = e.target.files[0];
                const secureUrl = await uploadToCloudinary(file);
                setAppForm(prev => ({ ...prev, bannerUrl: secureUrl }));
            } else if (type === 'appScreenshots') {
                const files = Array.from(e.target.files);
                const urls: string[] = [];
                for (const file of files) {
                    const secureUrl = await uploadToCloudinary(file);
                    urls.push(secureUrl);
                }
                setAppForm(prev => ({ ...prev, screenshots: [...prev.screenshots, ...urls] }));
            } else {
                const files = Array.from(e.target.files);
                const urls: string[] = [];
                for (const file of files) {
                    const secureUrl = await uploadToCloudinary(file);
                    urls.push(secureUrl);
                }
                setProjectForm(prev => ({ ...prev, photos: [...prev.photos, ...urls] }));
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao fazer upload da imagem. Verifique suas credenciais.");
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleRemovePhoto = (indexToRemove: number) => {
        setProjectForm(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== indexToRemove)
        }));
    };

    const handleAddTag = (val: string) => {
        const cleaned = val.trim().replace(/,/g, '');
        if (cleaned && !projectForm.tags.includes(cleaned)) {
            setProjectForm(prev => ({ ...prev, tags: [...prev.tags, cleaned] }));
        }
        setTagInput('');
    };

    const handleRemoveTag = (indexToRemove: number) => {
        setProjectForm(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== indexToRemove)
        }));
    };

    const handleAddFeature = (val: string) => {
        const cleaned = val.trim();
        if (cleaned) {
            setProjectForm(prev => ({ ...prev, details: [...prev.details, cleaned] }));
        }
        setFeatureInput('');
    };

    const handleRemoveFeature = (indexToRemove: number) => {
        setProjectForm(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== indexToRemove)
        }));
    };

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

    // --- Projects Handlers ---
    const handleNewProject = () => {
        setEditingProjectId(null);
        setProjectForm({ title: '', description: '', imageUrl: '', link: '', tags: [], details: [], photos: [] });
        setTagInput('');
        setFeatureInput('');
        setGalleryUrlInput('');
        setView('edit');
    };

    const handleEditProject = (project: Project) => {
        setEditingProjectId(project.id);
        setProjectForm({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            link: project.link || '',
            tags: Array.isArray(project.tags) ? project.tags : [],
            details: Array.isArray(project.details) ? project.details : [],
            photos: Array.isArray(project.photos) ? project.photos : []
        });
        setTagInput('');
        setFeatureInput('');
        setGalleryUrlInput('');
        setView('edit');
    };

    const handleSaveProject = async () => {
        setLoading(true);
        try {
            const finalTags = [...projectForm.tags];
            if (tagInput.trim()) {
                const cleaned = tagInput.trim().replace(/,/g, '');
                if (cleaned && !finalTags.includes(cleaned)) {
                    finalTags.push(cleaned);
                }
            }

            const finalDetails = [...projectForm.details];
            if (featureInput.trim()) {
                finalDetails.push(featureInput.trim());
            }

            const finalPhotos = [...projectForm.photos];
            if (galleryUrlInput.trim() && !finalPhotos.includes(galleryUrlInput.trim())) {
                finalPhotos.push(galleryUrlInput.trim());
            }

            const projectData = {
                title: projectForm.title,
                description: projectForm.description,
                imageUrl: projectForm.imageUrl,
                link: projectForm.link,
                tags: finalTags,
                details: finalDetails,
                photos: finalPhotos
            };
            if (editingProjectId) await updateProject(editingProjectId, projectData);
            else await addProject(projectData);
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            alert("Erro ao salvar projeto");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!editingProjectId || !confirm("Tem certeza que deseja apagar este projeto?")) return;
        setLoading(true);
        try {
            await deleteProject(editingProjectId);
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            alert("Erro ao deletar");
        } finally {
            setLoading(false);
        }
    };

    // --- Tools Handlers ---
    const handleNewTool = () => {
        setEditingToolId(null);
        setToolForm({ title: '', link: '', html: '', css: '', spanDesktop: 3, spanTablet: 6, spanMobile: 1, order: tools.length });
        setView('edit');
    };

    const handleEditTool = (tool: ToolItem) => {
        setEditingToolId(tool.id);
        setToolForm({
            title: tool.title,
            link: tool.link,
            html: tool.html,
            css: tool.css,
            spanDesktop: tool.spanDesktop,
            spanTablet: tool.spanTablet,
            spanMobile: tool.spanMobile,
            order: tool.order
        });
        setView('edit');
    };

    const handleSaveTool = async () => {
        setLoading(true);
        try {
            if (editingToolId) await updateTool(editingToolId, toolForm);
            else await addTool(toolForm);
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            alert("Erro ao salvar ferramenta");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTool = async () => {
        if (!editingToolId || !confirm("Tem certeza que deseja apagar esta ferramenta?")) return;
        setLoading(true);
        try {
            await deleteTool(editingToolId);
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            alert("Erro ao deletar");
        } finally {
            setLoading(false);
        }
    };

    const loadTemplate = (templateName: keyof typeof TEMPLATES) => {
        const t = TEMPLATES[templateName];
        setToolForm(prev => ({
            ...prev,
            html: t.html,
            css: t.css,
            spanDesktop: t.spanDesktop,
            spanTablet: t.spanTablet,
            spanMobile: t.spanMobile
        }));
    };

    // --- Apps Handlers ---
    const handleNewApp = () => {
        setEditingAppId(null);
        setAppForm({
            name: '',
            iconUrl: '',
            description: '',
            category: '',
            bannerUrl: '',
            fileSize: '',
            downloadUrl: '',
            version: '1.0.0',
            developer: 'João Vitório',
            platforms: ['Windows'],
            screenshots: [],
            order: apps.length
        });
        setView('edit');
    };

    const handleEditApp = (app: AppItem) => {
        setEditingAppId(app.id);
        setAppForm({
            name: app.name,
            iconUrl: app.iconUrl,
            description: app.description,
            category: app.category,
            bannerUrl: app.bannerUrl,
            fileSize: app.fileSize,
            downloadUrl: app.downloadUrl,
            version: app.version || '1.0.0',
            developer: app.developer || 'João Vitório',
            platforms: Array.isArray(app.platforms) && app.platforms.length > 0 ? app.platforms : ['Windows'],
            screenshots: Array.isArray(app.screenshots) ? app.screenshots : [],
            order: app.order !== undefined ? app.order : 0
        });
        setView('edit');
    };

    const togglePlatform = (plat: string) => {
        setAppForm(prev => {
            const exists = prev.platforms.includes(plat);
            if (exists) {
                if (prev.platforms.length <= 1) return prev;
                return { ...prev, platforms: prev.platforms.filter(p => p !== plat) };
            } else {
                return { ...prev, platforms: [...prev.platforms, plat] };
            }
        });
    };

    const handleRemoveAppScreenshot = (idxToRemove: number) => {
        setAppForm(prev => ({
            ...prev,
            screenshots: prev.screenshots.filter((_, idx) => idx !== idxToRemove)
        }));
    };

    const handleSaveApp = async () => {
        if (!appForm.name.trim()) {
            alert("O nome do aplicativo é obrigatório.");
            return;
        }
        setLoading(true);
        try {
            const appData = {
                name: appForm.name.trim(),
                iconUrl: appForm.iconUrl.trim(),
                description: appForm.description.trim(),
                category: appForm.category.trim() || 'Geral',
                bannerUrl: appForm.bannerUrl.trim(),
                fileSize: appForm.fileSize.trim(),
                downloadUrl: appForm.downloadUrl.trim(),
                version: appForm.version.trim() || '1.0.0',
                developer: appForm.developer.trim() || 'João Vitório',
                platforms: appForm.platforms.length > 0 ? appForm.platforms : ['Windows'],
                screenshots: appForm.screenshots || [],
                order: Number(appForm.order) || 0
            };
            if (editingAppId) {
                await updateApp(editingAppId, appData);
            } else {
                await addApp(appData);
            }
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            console.error("Erro ao salvar aplicativo:", error);
            alert("Erro ao salvar aplicativo.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteApp = async () => {
        if (!editingAppId || !confirm("Tem certeza que deseja apagar este aplicativo?")) return;
        setLoading(true);
        try {
            await deleteApp(editingAppId);
            setRefresh(prev => prev + 1);
            setView('list');
        } catch (error) {
            alert("Erro ao deletar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Atmospheric dark blue glows from design system */}
            <div className={styles.ambientGlowTop} />
            <div className={styles.ambientGlowBottom} />
            <div className={styles.subtleVignette} />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} animate-item-left stagger-1`}>
                <div className={styles.brand}>
                    <div className={styles.brandBadge}>
                        <img src="/jv-logo.png" alt="JV Logo" className={styles.brandLogo} />
                    </div>
                    <div className={styles.brandInfo}>
                        <span className={styles.brandName}>JVDev</span>
                        <span className={styles.brandRole}>Admin Area</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.navItem} onClick={() => navigate('/')}>
                        <FiHome className={styles.navIcon} /> Go to Site
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'projects' ? styles.navItemActive : ''}`}
                        onClick={() => { setActiveTab('projects'); setView('list'); }}
                    >
                        <FiBox className={styles.navIcon} /> Projects
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'tools' ? styles.navItemActive : ''}`}
                        onClick={() => { setActiveTab('tools'); setView('list'); }}
                    >
                        <FiLayers className={styles.navIcon} /> Tools (Bento)
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'apps' ? styles.navItemActive : ''}`}
                        onClick={() => { setActiveTab('apps'); setView('list'); }}
                    >
                        <FiSmartphone className={styles.navIcon} /> Apps Store
                    </div>
                </nav>

                <button className={styles.logoutButton} onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className={`${styles.main} animate-item stagger-2`}>
                {view === 'list' && activeTab === 'projects' && (
                    <>
                        <header className={styles.pageHeader}>
                            <div className={styles.pageTitle}>
                                <h1>Projects</h1>
                                <p>Manage and organize your portfolio projects.</p>
                            </div>
                            <button className={styles.primaryButton} onClick={handleNewProject}>
                                <FiPlus /> New Project
                            </button>
                        </header>
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
                                            <div style={{ display: 'flex', gap: 10 }}><span>{p.likes} likes</span><span>{p.views} views</span></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'edit' && activeTab === 'projects' && (
                    <div className={styles.formContainer}>
                        <header className={styles.pageHeader} style={{ borderBottom: 'none', marginBottom: 20 }}>
                            <div className={styles.pageTitle}>
                                <button className={styles.secondaryButton} onClick={() => setView('list')} style={{ marginBottom: 16 }}>
                                    <FiArrowLeft /> Back to List
                                </button>
                                <h1>{editingProjectId ? 'Edit Project' : 'Create New Project'}</h1>
                            </div>
                            <div className={styles.actions} style={{ display: 'flex', gap: 12 }}>
                                {editingProjectId && (
                                    <button className={styles.dangerButton} onClick={handleDeleteProject} disabled={loading}>
                                        <FiTrash2 /> Delete
                                    </button>
                                )}
                                <button className={styles.primaryButton} onClick={handleSaveProject} disabled={loading}>
                                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </header>

                        {/* Add existing form fields here for brevity... */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}><div className={styles.sectionNumber}>1</div><div className={styles.sectionTitle}>Basic Information</div></div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Project Title</label>
                                    <input className={styles.input} value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Description</label>
                                    <textarea className={styles.textarea} value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Project Link (URL)</label>
                                    <input className={styles.input} value={projectForm.link} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>2</div>
                                <div className={styles.sectionTitle}>Visuals & Media</div>
                            </div>
                            <div className={styles.sectionContent}>
                                {/* Cover Image */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Cover Image</label>
                                    <div className={styles.urlInputRow}>
                                        <input
                                            className={styles.input}
                                            placeholder="Paste image URL or upload to Cloudinary..."
                                            value={projectForm.imageUrl}
                                            onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                                        />
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FiUpload />
                                            <span>{uploading ? 'Uploading...' : 'Upload Cover'}</span>
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} disabled={uploading} />
                                        </label>
                                    </div>

                                    {/* Cover Preview */}
                                    {projectForm.imageUrl && (
                                        <div className={styles.coverPreviewCard}>
                                            <img
                                                src={projectForm.imageUrl}
                                                alt="Cover preview"
                                                className={styles.coverPreviewImage}
                                                onClick={() => openModal(projectForm.imageUrl)}
                                            />
                                            <div className={styles.previewOverlay}>
                                                <button
                                                    type="button"
                                                    title="View full image"
                                                    className={styles.previewIconBtn}
                                                    onClick={() => openModal(projectForm.imageUrl)}
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Remove cover"
                                                    className={`${styles.previewIconBtn} ${styles.previewIconBtnDanger}`}
                                                    onClick={() => setProjectForm({ ...projectForm, imageUrl: '' })}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                            <span className={styles.previewBadge}>Cover Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Gallery Images */}
                                <div className={styles.inputGroup}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label className={styles.label} style={{ margin: 0 }}>
                                            Gallery Images {projectForm.photos.length > 0 && <span className={styles.counterBadge}>({projectForm.photos.length})</span>}
                                        </label>
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', fontSize: '0.8rem' }}>
                                            <FiUpload />
                                            <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
                                            <input type="file" hidden multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} disabled={uploading} />
                                        </label>
                                    </div>

                                    {/* Quick URL Adder for Gallery */}
                                    <div className={styles.urlInputRow} style={{ marginBottom: '14px' }}>
                                        <input
                                            className={styles.input}
                                            placeholder="Or paste an image URL and click Add..."
                                            value={galleryUrlInput}
                                            onChange={e => setGalleryUrlInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (galleryUrlInput.trim()) {
                                                        setProjectForm(prev => ({ ...prev, photos: [...prev.photos, galleryUrlInput.trim()] }));
                                                        setGalleryUrlInput('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={styles.secondaryButton}
                                            onClick={() => {
                                                if (galleryUrlInput.trim()) {
                                                    setProjectForm(prev => ({ ...prev, photos: [...prev.photos, galleryUrlInput.trim()] }));
                                                    setGalleryUrlInput('');
                                                }
                                            }}
                                        >
                                            <FiPlus /> Add
                                        </button>
                                    </div>

                                    {/* Gallery Preview Grid */}
                                    {projectForm.photos.length > 0 ? (
                                        <div className={styles.galleryPreviewGrid}>
                                            {projectForm.photos.map((photoUrl, idx) => (
                                                <div key={idx} className={styles.galleryPreviewItem}>
                                                    <img
                                                        src={photoUrl}
                                                        alt={`Gallery ${idx + 1}`}
                                                        className={styles.galleryPreviewImage}
                                                        onClick={() => openModal(photoUrl)}
                                                    />
                                                    <div className={styles.previewOverlay}>
                                                        <button
                                                            type="button"
                                                            title="View full image"
                                                            className={styles.previewIconBtn}
                                                            onClick={() => openModal(photoUrl)}
                                                        >
                                                            <FiEye size={15} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Delete photo"
                                                            className={`${styles.previewIconBtn} ${styles.previewIconBtnDanger}`}
                                                            onClick={() => handleRemovePhoto(idx)}
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                    <span className={styles.previewIndexBadge}>{idx + 1}</span>
                                                </div>
                                            ))}
                                            {uploading && (
                                                <div className={styles.galleryUploadingItem}>
                                                    <div className={styles.loadingSpinner} />
                                                    <span>Uploading...</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyGalleryBox}>
                                            {uploading ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div className={styles.loadingSpinner} />
                                                    <span>Uploading to Cloudinary...</span>
                                                </div>
                                            ) : (
                                                <span>No gallery images yet. Click "Upload Photos" or paste a URL above.</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>3</div>
                                <div className={styles.sectionTitle}>Configuration</div>
                            </div>
                            <div className={styles.sectionContent}>
                                {/* Tags as interactive chips */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        Tags {projectForm.tags.length > 0 && <span className={styles.counterBadge}>({projectForm.tags.length})</span>}
                                    </label>
                                    <div className={styles.tagsContainer}>
                                        {projectForm.tags.map((tag, idx) => (
                                            <span key={idx} className={styles.tagBadge}>
                                                {tag}
                                                <button
                                                    type="button"
                                                    className={styles.tagCloseBtn}
                                                    onClick={() => handleRemoveTag(idx)}
                                                    title={`Remove ${tag}`}
                                                >
                                                    <FiX size={13} />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            className={styles.tagInput}
                                            placeholder={projectForm.tags.length === 0 ? "Type tag & press Enter or comma..." : "Add another tag..."}
                                            value={tagInput}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (val.includes(',')) {
                                                    handleAddTag(val);
                                                } else {
                                                    setTagInput(val);
                                                }
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' || e.key === ',') {
                                                    e.preventDefault();
                                                    handleAddTag(tagInput);
                                                } else if (e.key === 'Backspace' && !tagInput && projectForm.tags.length > 0) {
                                                    handleRemoveTag(projectForm.tags.length - 1);
                                                }
                                            }}
                                        />
                                    </div>
                                    <span className={styles.inputHint}>Press <kbd>Enter</kbd> or type <kbd>,</kbd> to convert text into a tag.</span>
                                </div>

                                {/* Features List as interactive list/chips */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        Features List {projectForm.details.length > 0 && <span className={styles.counterBadge}>({projectForm.details.length})</span>}
                                    </label>
                                    <div className={styles.urlInputRow} style={{ marginBottom: projectForm.details.length > 0 ? '12px' : '6px' }}>
                                        <input
                                            className={styles.input}
                                            placeholder="Add a key feature or highlight and press Enter..."
                                            value={featureInput}
                                            onChange={e => setFeatureInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddFeature(featureInput);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={styles.secondaryButton}
                                            onClick={() => handleAddFeature(featureInput)}
                                        >
                                            <FiPlus /> Add
                                        </button>
                                    </div>

                                    {projectForm.details.length > 0 && (
                                        <div className={styles.featuresList}>
                                            {projectForm.details.map((feat, idx) => (
                                                <div key={idx} className={styles.featureItem}>
                                                    <span className={styles.featureBullet}>✦</span>
                                                    <span className={styles.featureText}>{feat}</span>
                                                    <button
                                                        type="button"
                                                        className={styles.featureRemoveBtn}
                                                        onClick={() => handleRemoveFeature(idx)}
                                                        title="Remove feature"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <span className={styles.inputHint}>Press <kbd>Enter</kbd> to add to the features list.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TOOLS SECTION */}
                {view === 'list' && activeTab === 'tools' && (
                    <>
                        <header className={styles.pageHeader}>
                            <div className={styles.pageTitle}>
                                <h1>Bento Tools</h1>
                                <p>Manage the tools appearing on the /utils Bento Box.</p>
                            </div>
                            <button className={styles.primaryButton} onClick={handleNewTool}>
                                <FiPlus /> New Tool
                            </button>
                        </header>
                        <div className={styles.projectsGrid}>
                            {tools.map(t => (
                                <div key={t.id} className={styles.projectCard} onClick={() => handleEditTool(t)}>
                                    <div className={styles.cardContent} style={{ padding: '20px' }}>
                                        <h3 className={styles.cardTitle} style={{ margin: 0, color: '#58a6ff' }}>{t.title || 'Untitled Tool'}</h3>
                                        <div className={styles.cardMeta} style={{ marginTop: '10px', color: '#888' }}>
                                            <span>Link: {t.link || 'N/A'}</span>
                                            <span>Span: {t.spanDesktop} cols</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {tools.length === 0 && <p style={{ color: '#888' }}>No tools found. Add one to populate your Bento Grid!</p>}
                        </div>
                    </>
                )}

                {view === 'edit' && activeTab === 'tools' && (
                    <div className={styles.formContainer}>
                        <header className={styles.pageHeader} style={{ borderBottom: 'none', marginBottom: 20 }}>
                            <div className={styles.pageTitle}>
                                <button className={styles.secondaryButton} onClick={() => setView('list')} style={{ marginBottom: 16 }}>
                                    <FiArrowLeft /> Back to List
                                </button>
                                <h1>{editingToolId ? 'Edit Tool' : 'Create New Tool'}</h1>
                            </div>
                            <div className={styles.actions} style={{ display: 'flex', gap: 12 }}>
                                {editingToolId && (
                                    <button className={styles.dangerButton} onClick={handleDeleteTool} disabled={loading}>
                                        <FiTrash2 /> Delete
                                    </button>
                                )}
                                <button className={styles.primaryButton} onClick={handleSaveTool} disabled={loading}>
                                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Column 1: Config & Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className={styles.infoBox}>
                                    <div style={{ marginTop: 2 }}>💡</div>
                                    <div>
                                        <strong>Load a Reference Template</strong><br />
                                        Click a button below to pre-fill the HTML/CSS with standard Bento Grid templates.
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                                        <button className={styles.secondaryButton} onClick={() => loadTemplate('Pricing')}>Pink/Blue Gradient</button>
                                        <button className={styles.secondaryButton} onClick={() => loadTemplate('DarkSmall')}>Small Dark</button>
                                        <button className={styles.secondaryButton} onClick={() => loadTemplate('SilverWide')}>Silver Wide</button>
                                        <button className={styles.secondaryButton} onClick={() => loadTemplate('LargeDashboard')}>Large Dashboard</button>
                                        <button className={styles.secondaryButton} onClick={() => loadTemplate('GreenRegex')}>Green Regex</button>
                                    </div>
                                </div>

                                <div className={styles.formSection} style={{ flex: 1 }}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.sectionTitle}>Basic Configuration</div>
                                    </div>
                                    <div className={styles.sectionContent}>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.label}>Tool Identifier / Title</label>
                                            <input className={styles.input} value={toolForm.title} onChange={e => setToolForm({ ...toolForm, title: e.target.value })} placeholder="e.g. Password Generator" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.label}>Redirect Link (URL)</label>
                                            <input className={styles.input} value={toolForm.link} onChange={e => setToolForm({ ...toolForm, link: e.target.value })} placeholder="/tools/password-gen" />
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                            <div className={styles.inputGroup} style={{ flex: 1, minWidth: '100px' }}>
                                                <label className={styles.label}>Desktop Span</label>
                                                <input type="number" min="1" max="12" className={styles.input} value={toolForm.spanDesktop} onChange={e => setToolForm({ ...toolForm, spanDesktop: Number(e.target.value) })} />
                                            </div>
                                            <div className={styles.inputGroup} style={{ flex: 1, minWidth: '100px' }}>
                                                <label className={styles.label}>Tablet Span</label>
                                                <input type="number" min="1" max="6" className={styles.input} value={toolForm.spanTablet} onChange={e => setToolForm({ ...toolForm, spanTablet: Number(e.target.value) })} />
                                            </div>
                                            <div className={styles.inputGroup} style={{ flex: 1, minWidth: '100px' }}>
                                                <label className={styles.label}>Order (Sort)</label>
                                                <input type="number" className={styles.input} value={toolForm.order} onChange={e => setToolForm({ ...toolForm, order: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Code Editors */}
                            <div className={styles.formSection} style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                                <div className={styles.sectionHeader}>
                                    <div className={styles.sectionTitle}><FiCode style={{ marginRight: '8px' }} /> Raw HTML & CSS</div>
                                </div>
                                <div className={styles.sectionContent} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className={styles.inputGroup} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <label className={styles.label}>Custom HTML</label>
                                        <textarea
                                            className={styles.textarea}
                                            style={{ fontFamily: 'monospace', flex: 1, minHeight: '120px' }}
                                            value={toolForm.html}
                                            onChange={e => setToolForm({ ...toolForm, html: e.target.value })}
                                            placeholder="<div class='my-card'>...</div>"
                                        />
                                    </div>
                                    <div className={styles.inputGroup} style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
                                        <label className={styles.label}>Custom CSS</label>
                                        <textarea
                                            className={styles.textarea}
                                            style={{ fontFamily: 'monospace', flex: 1, minHeight: '120px' }}
                                            value={toolForm.css}
                                            onChange={e => setToolForm({ ...toolForm, css: e.target.value })}
                                            placeholder=".my-card { background: red; }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LIVE PREVIEW SECTION */}
                        <div className={styles.formSection} style={{ marginTop: '20px' }}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionTitle}>Live Preview (Desktop View)</div>
                            </div>
                            <div className={styles.sectionContent} style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#000000', padding: '40px', borderRadius: '8px', overflowX: 'auto' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(12, 1fr)',
                                    gridAutoRows: '240px',
                                    gap: '20px',
                                    width: '100%',
                                    minWidth: '800px',
                                    maxWidth: '1100px'
                                }}>
                                    <div style={{ gridColumn: `span ${toolForm.spanDesktop}`, textDecoration: 'none', color: '#fff', position: 'relative' }}>
                                        <style>{`
                                            .wrapper-preview-admin {
                                                border-radius: 28px;
                                                height: 100%;
                                                width: 100%;
                                                overflow: hidden;
                                                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                            }
                                            ${toolForm.css}
                                        `}</style>
                                        <div
                                            className="wrapper-preview-admin"
                                            dangerouslySetInnerHTML={{ __html: toolForm.html }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* APPS SECTION */}
                {view === 'list' && activeTab === 'apps' && (
                    <>
                        <header className={styles.pageHeader}>
                            <div className={styles.pageTitle}>
                                <h1>Apps Store</h1>
                                <p>Gerencie e organize seus aplicativos, instaladores e links de download.</p>
                            </div>
                            <button className={styles.primaryButton} onClick={handleNewApp}>
                                <FiPlus /> New App
                            </button>
                        </header>
                        <div className={styles.appsAdminGrid}>
                            {apps.map(app => (
                                <div key={app.id} className={styles.appAdminCard} onClick={() => handleEditApp(app)}>
                                    <div className={styles.appAdminIconWrapper}>
                                        {app.iconUrl ? (
                                            <img src={app.iconUrl} alt={app.name} className={styles.appAdminIcon} />
                                        ) : (
                                            <FiSmartphone size={28} color="#58a6ff" />
                                        )}
                                    </div>
                                    <div className={styles.appAdminInfo}>
                                        <div className={styles.appAdminHeaderRow}>
                                            <h3 className={styles.appAdminTitle}>{app.name}</h3>
                                            <span className={styles.appAdminCategory}>{app.category || 'Geral'}</span>
                                        </div>
                                        <p className={styles.appAdminDesc}>{app.description || 'Sem descrição cadastrada.'}</p>
                                        <div className={styles.appAdminMeta}>
                                            <span>{app.fileSize || 'Tamanho N/A'}</span>
                                            {app.downloadUrl ? (
                                                <span className={styles.downloadAvailableBadge}>● Link Ativo</span>
                                            ) : (
                                                <span className={styles.downloadMissingBadge}>● Sem Link</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {apps.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#8c93a0', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <p style={{ margin: 0 }}>Nenhum aplicativo cadastrado ainda. Clique em "+ New App" para cadastrar seu primeiro aplicativo!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {view === 'edit' && activeTab === 'apps' && (
                    <div className={styles.formContainer}>
                        <header className={styles.pageHeader} style={{ borderBottom: 'none', marginBottom: 20 }}>
                            <div className={styles.pageTitle}>
                                <button className={styles.secondaryButton} onClick={() => setView('list')} style={{ marginBottom: 16 }}>
                                    <FiArrowLeft /> Voltar para Lista
                                </button>
                                <h1>{editingAppId ? 'Editar Aplicativo' : 'Cadastrar Novo Aplicativo'}</h1>
                            </div>
                            <div className={styles.actions} style={{ display: 'flex', gap: 12 }}>
                                {editingAppId && (
                                    <button className={styles.dangerButton} onClick={handleDeleteApp} disabled={loading}>
                                        <FiTrash2 /> Excluir
                                    </button>
                                )}
                                <button className={styles.primaryButton} onClick={handleSaveApp} disabled={loading}>
                                    <FiSave /> {loading ? 'Salvando...' : 'Salvar Aplicativo'}
                                </button>
                            </div>
                        </header>

                        {/* SECTION 1: INFORMAÇÕES BÁSICAS */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>1</div>
                                <div className={styles.sectionTitle}>Informações Básicas</div>
                            </div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nome do Aplicativo</label>
                                    <input
                                        className={styles.input}
                                        value={appForm.name}
                                        onChange={e => setAppForm({ ...appForm, name: e.target.value })}
                                        placeholder="Ex: Meu App Pro"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Categoria</label>
                                    <input
                                        className={styles.input}
                                        value={appForm.category}
                                        onChange={e => setAppForm({ ...appForm, category: e.target.value })}
                                        placeholder="Ex: Utilitários, Produtividade, Mobile, Jogos, Dev..."
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Plataformas Suportadas</label>
                                    <div className={styles.platformsToggleGroup}>
                                        {['Windows', 'macOS', 'Android', 'Web'].map(plat => {
                                            const active = appForm.platforms.includes(plat);
                                            return (
                                                <button
                                                    key={plat}
                                                    type="button"
                                                    className={`${styles.platformPill} ${active ? styles.platformPillActive : ''}`}
                                                    onClick={() => togglePlatform(plat)}
                                                >
                                                    {plat === 'Windows' && <FaWindows size={14} />}
                                                    {plat === 'macOS' && <FaApple size={15} />}
                                                    {plat === 'Android' && <FaAndroid size={15} />}
                                                    {plat === 'Web' && <FiGlobe size={14} />}
                                                    <span>{plat}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <span className={styles.inputHint}>Selecione uma ou mais plataformas compatíveis (Windows, macOS, Android, Web).</span>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Descrição Completa</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={appForm.description}
                                        onChange={e => setAppForm({ ...appForm, description: e.target.value })}
                                        placeholder="Descreva as funcionalidades do aplicativo, compatibilidade, requisitos e novidades..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: MÍDIA & VISUALS */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>2</div>
                                <div className={styles.sectionTitle}>Mídia & Visuals</div>
                            </div>
                            <div className={styles.sectionContent}>
                                {/* App Icon */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Ícone do App (Square / Squircle)</label>
                                    <div className={styles.urlInputRow}>
                                        <input
                                            className={styles.input}
                                            placeholder="Cole a URL do ícone ou faça upload no Cloudinary..."
                                            value={appForm.iconUrl}
                                            onChange={e => setAppForm({ ...appForm, iconUrl: e.target.value })}
                                        />
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FiUpload />
                                            <span>{uploading ? 'Enviando...' : 'Upload Ícone'}</span>
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'appIcon')} disabled={uploading} />
                                        </label>
                                    </div>

                                    {appForm.iconUrl && (
                                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ width: 68, height: 68, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(45, 90, 185, 0.45)', background: '#080a0f', boxShadow: '0 4px 14px rgba(0,0,0,0.5)' }}>
                                                <img src={appForm.iconUrl} alt="Icon Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => openModal(appForm.iconUrl)} />
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button type="button" className={styles.secondaryButton} onClick={() => openModal(appForm.iconUrl)}>
                                                    <FiEye size={14} /> Ver
                                                </button>
                                                <button type="button" className={styles.dangerButton} onClick={() => setAppForm({ ...appForm, iconUrl: '' })}>
                                                    <FiTrash2 size={14} /> Remover
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Banner Image */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Banner de Apresentação (Capa)</label>
                                    <div className={styles.urlInputRow}>
                                        <input
                                            className={styles.input}
                                            placeholder="Cole a URL do banner ou faça upload no Cloudinary..."
                                            value={appForm.bannerUrl}
                                            onChange={e => setAppForm({ ...appForm, bannerUrl: e.target.value })}
                                        />
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FiUpload />
                                            <span>{uploading ? 'Enviando...' : 'Upload Banner'}</span>
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'appBanner')} disabled={uploading} />
                                        </label>
                                    </div>

                                    {appForm.bannerUrl && (
                                        <div className={styles.coverPreviewCard}>
                                            <img
                                                src={appForm.bannerUrl}
                                                alt="Banner preview"
                                                className={styles.coverPreviewImage}
                                                onClick={() => openModal(appForm.bannerUrl)}
                                            />
                                            <div className={styles.previewOverlay}>
                                                <button
                                                    type="button"
                                                    title="Visualizar em tela cheia"
                                                    className={styles.previewIconBtn}
                                                    onClick={() => openModal(appForm.bannerUrl)}
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Remover banner"
                                                    className={`${styles.previewIconBtn} ${styles.previewIconBtnDanger}`}
                                                    onClick={() => setAppForm({ ...appForm, bannerUrl: '' })}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                            <span className={styles.previewBadge}>Banner do App</span>
                                        </div>
                                    )}
                                </div>

                                {/* Screenshots Gallery */}
                                <div className={styles.inputGroup}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label className={styles.label} style={{ margin: 0 }}>
                                            Capturas de Tela (Screenshots) {appForm.screenshots.length > 0 && <span className={styles.counterBadge}>({appForm.screenshots.length})</span>}
                                        </label>
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', fontSize: '0.8rem' }}>
                                            <FiUpload />
                                            <span>{uploading ? 'Enviando...' : 'Upload Screenshots'}</span>
                                            <input type="file" hidden multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'appScreenshots')} disabled={uploading} />
                                        </label>
                                    </div>

                                    {appForm.screenshots.length > 0 ? (
                                        <div className={styles.galleryPreviewGrid}>
                                            {appForm.screenshots.map((shotUrl, idx) => (
                                                <div key={idx} className={styles.galleryPreviewItem}>
                                                    <img
                                                        src={shotUrl}
                                                        alt={`Screenshot ${idx + 1}`}
                                                        className={styles.galleryPreviewImage}
                                                        onClick={() => openModal(shotUrl)}
                                                    />
                                                    <div className={styles.previewOverlay}>
                                                        <button
                                                            type="button"
                                                            title="Ver imagem"
                                                            className={styles.previewIconBtn}
                                                            onClick={() => openModal(shotUrl)}
                                                        >
                                                            <FiEye size={15} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Remover screenshot"
                                                            className={`${styles.previewIconBtn} ${styles.previewIconBtnDanger}`}
                                                            onClick={() => handleRemoveAppScreenshot(idx)}
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                    <span className={styles.previewIndexBadge}>{idx + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyGalleryBox}>
                                            <span>Nenhuma captura de tela enviada ainda. Faça upload de screenshots para exibir na vitrine.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: ARQUIVO & DOWNLOAD */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionNumber}>3</div>
                                <div className={styles.sectionTitle}>Arquivo & Download</div>
                            </div>
                            <div className={styles.sectionContent}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Tamanho do Arquivo</label>
                                        <input
                                            className={styles.input}
                                            value={appForm.fileSize}
                                            onChange={e => setAppForm({ ...appForm, fileSize: e.target.value })}
                                            placeholder="Ex: 45 MB, 1.2 GB..."
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Versão</label>
                                        <input
                                            className={styles.input}
                                            value={appForm.version}
                                            onChange={e => setAppForm({ ...appForm, version: e.target.value })}
                                            placeholder="Ex: 1.0.0"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Desenvolvedor</label>
                                        <input
                                            className={styles.input}
                                            value={appForm.developer}
                                            onChange={e => setAppForm({ ...appForm, developer: e.target.value })}
                                            placeholder="Ex: João Vitório"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Ordem de Exibição</label>
                                        <input
                                            className={styles.input}
                                            type="number"
                                            value={appForm.order}
                                            onChange={e => setAppForm({ ...appForm, order: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Link para Download (MediaFire, Drive, etc.)</label>
                                    <input
                                        className={styles.input}
                                        value={appForm.downloadUrl}
                                        onChange={e => setAppForm({ ...appForm, downloadUrl: e.target.value })}
                                        placeholder="https://www.mediafire.com/file/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <ImageModal isOpen={isModalOpen} imageUrl={selectedImage} onClose={closeModal} />
        </div>
    );
}
