import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import ProfileCard from '../../components/profile-card/ProfileCard'
import ProjectCard from '../../components/project-card/ProjectCard'
import styles from './Home.module.css'
import { subscribeToProjects, type Project } from '../../services/projectsService';

function App() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const formatViews = (views: number) => {
    if (views > 999) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views;
  };

  useEffect(() => {
    const unsubscribe = subscribeToProjects((data) => {
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: '#fff' }}>Carregando projetos...</div>;
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
            <h2>Sobre mim</h2>
            <p>
              Atualmente trabalho com <strong>Delphi</strong> em uma empresa que atua na área de automação comercial, onde
              eu desenvolvo um software de <strong>migração de dados</strong>, de outros sistemas para o sistema da empresa que atuo.
              Com o desenvolvimento do conversor, pude aprender diversos tópicos na área de desenvolvimento, como <strong>Design Paterns</strong>,
              <strong> SQL</strong> e <strong>NoSQL</strong>, melhorias de performace utilizando ArrayDML recurso do FireDAC, e entre outros tópicos.
              No tempo livre, eu programo com <strong>Flutter</strong> em projetos mobile e quando quero criar algo para Web, utilizo <strong>React</strong> , <strong>NextJs</strong> e para o
              BackEnd uso <strong>Python</strong> com <strong>FastApi</strong> ou uso <strong>Express</strong> + <strong>TypeScript</strong>.
            </p>
          </div>

          <div>
            <h2 className={styles.subSectionTitle}>Projetos em Destaque</h2>

            {/* Hero Project */}
            {featuredProject ? (
              <div className={styles.featuredProject} onClick={() => navigate(`/project/${featuredProject.id}`)}>
                <img
                  src={featuredProject.imageUrl}
                  alt={featuredProject.title}
                  className={styles.featuredImage}
                  fetchPriority="high"
                />
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
