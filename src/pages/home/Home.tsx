import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import ProfileCard from '../../components/profile-card/ProfileCard'
import ProjectCard from '../../components/project-card/ProjectCard'
import styles from './Home.module.css'
import { getProjects, type Project } from '../../services/projectsService';

function App() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatViews = (views: number) => {
    if (views > 999) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views;
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError("Erro ao buscar projetos. Verifique o console ou as regras do Firebase.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: '#fff' }}>Carregando projetos...</div>;
  }

  if (error) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: '#ff6b6b', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <p>{error}</p>
        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Tente reiniciar o servidor (npm run dev) para carregar as variáveis de ambiente.</p>
      </div>
    );
  }

  const featuredProject = projects.length > 0 ? projects[0] : null;
  const otherProjects = projects.length > 1 ? projects.slice(1) : [];

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.profileSection}>
          <ProfileCard />
        </div>
        <div className={styles.contentSection}>
          <div>
            <h1>Sobre mim</h1>
            <p>
              Atualmente, atuo com <strong>Delphi</strong> em uma empresa especializada em automação comercial.
              Hoje, concentro meus estudos e projetos no desenvolvimento mobile com <strong>Flutter</strong> e na criação de interfaces web modernas com <strong>React</strong> e <strong>Next.js</strong>.
              Para o backend, utilizo <strong>TypeScript</strong> e <strong>Python (FastAPI)</strong> para construir APIs performáticas e escaláveis.
            </p>
          </div>

          <div>
            <h2 className={styles.subSectionTitle}>Projetos em Destaque</h2>

            {/* Hero Project */}
            {featuredProject ? (
              <div className={styles.featuredProject} onClick={() => navigate(`/project/${featuredProject.id}`)}>
                <img src={featuredProject.imageUrl} alt={featuredProject.title} className={styles.featuredImage} />
                <div className={styles.featuredOverlay}>
                  <h3 className={styles.featuredTitle}>{featuredProject.title}</h3>
                  <div className={styles.featuredStats}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiHeart /> {featuredProject.likes}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiEye /> {formatViews(featuredProject.views)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px', color: '#8b949e' }}>
                <p>Nenhum projeto encontrado. Adicione projetos no Firebase.</p>
              </div>
            )}

            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px', marginTop: '40px' }}>Explore Mais</h3>

            <div className={styles.projectsGrid}>
              {otherProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  imageUrl={project.imageUrl}
                  likes={project.likes}
                  views={project.views}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
