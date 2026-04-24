import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { getProjects, addProject, updateProject, deleteProject, type Project } from '../../services/projectsService';
import { getTools, addTool, updateTool, deleteTool, type ToolItem } from '../../services/toolsService';
import styles from './admin.module.css';
import { FiHome, FiBox, FiLogOut, FiPlus, FiTrash2, FiSave, FiArrowLeft, FiUpload, FiLink, FiLayers, FiCode } from 'react-icons/fi';
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
    const [activeTab, setActiveTab] = useState<'projects' | 'tools'>('projects');
    const [view, setView] = useState<'list' | 'edit'>('list');

    // Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [tools, setTools] = useState<ToolItem[]>([]);
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
        tags: '',
        details: '',
        photos: ''
    });

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

    useEffect(() => {
        async function fetchData() {
            if (activeTab === 'projects') {
                const data = await getProjects();
                setProjects(data);
            } else if (activeTab === 'tools') {
                const data = await getTools();
                setTools(data);
            }
        }
        fetchData();
    }, [refresh, activeTab]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        try {
            const secureUrl = await uploadToCloudinary(file);
            if (type === 'cover') {
                setProjectForm(prev => ({ ...prev, imageUrl: secureUrl }));
            } else {
                setProjectForm(prev => ({ ...prev, photos: prev.photos ? `${prev.photos}\n${secureUrl}` : secureUrl }));
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao fazer upload da imagem. Verifique suas credenciais.");
        } finally {
            setUploading(false);
        }
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
        setProjectForm({ title: '', description: '', imageUrl: '', link: '', tags: '', details: '', photos: '' });
        setView('edit');
    };

    const handleEditProject = (project: Project) => {
        setEditingProjectId(project.id);
        setProjectForm({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            link: project.link || '',
            tags: project.tags.join(', '),
            details: project.details.join('\n'),
            photos: project.photos.join('\n')
        });
        setView('edit');
    };

    const handleSaveProject = async () => {
        setLoading(true);
        try {
            const projectData = {
                title: projectForm.title,
                description: projectForm.description,
                imageUrl: projectForm.imageUrl,
                link: projectForm.link,
                tags: projectForm.tags.split(',').map(s => s.trim()).filter(Boolean),
                details: projectForm.details.split('\n').filter(Boolean),
                photos: projectForm.photos.split('\n').filter(Boolean)
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
                </nav>

                <button className={styles.logoutButton} onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
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
                            <div className={styles.sectionHeader}><div className={styles.sectionNumber}>2</div><div className={styles.sectionTitle}>Visuals & Media</div></div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Cover Image URL</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input className={styles.input} value={projectForm.imageUrl} onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })} style={{ flex: 1 }} />
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <FiUpload />
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Gallery Images (One URL per line)</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <textarea className={styles.textarea} style={{ flex: 1 }} value={projectForm.photos} onChange={e => setProjectForm({ ...projectForm, photos: e.target.value })} />
                                        <label className={styles.secondaryButton} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <FiUpload />
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}><div className={styles.sectionNumber}>3</div><div className={styles.sectionTitle}>Configuration</div></div>
                            <div className={styles.sectionContent}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Tags (Comma separated)</label>
                                    <input className={styles.input} value={projectForm.tags} onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Features List (One per line)</label>
                                    <textarea className={styles.textarea} value={projectForm.details} onChange={e => setProjectForm({ ...projectForm, details: e.target.value })} />
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
            </main>

            <ImageModal isOpen={isModalOpen} imageUrl={selectedImage} onClose={closeModal} />
        </div>
    );
}
