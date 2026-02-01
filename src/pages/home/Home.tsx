import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye } from 'react-icons/fi';
import ProfileCard from '../../components/profile-card/ProfileCard'
import ProjectCard from '../../components/project-card/ProjectCard'
import styles from './Home.module.css'

const mockProjects = [
  {
    id: 1,
    title: "E-Commerce Fullstack",
    description: "Uma plataforma completa de comércio eletrônico com sistema de pagamentos, gestão de estoque e painel administrativo. Desenvolvido com foco em escalabilidade e UX.",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    likes: 342,
    views: 1205,
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"]
  },
  {
    id: 2,
    title: "App de Delivery",
    imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
    likes: 890,
    views: 5400
  },
  {
    id: 3,
    title: "Dashboard Financeiro",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    likes: 567,
    views: 3200
  },
  {
    id: 4,
    title: "Landing Page Evento",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1412&q=80",
    likes: 230,
    views: 1800
  }
];

function App() {
  const navigate = useNavigate();
  const featuredProject = mockProjects[0];
  const otherProjects = mockProjects.slice(1);

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
            <div className={styles.featuredProject} onClick={() => navigate(`/project/${featuredProject.id}`)}>
              <img src={featuredProject.imageUrl} alt={featuredProject.title} className={styles.featuredImage} />
              <div className={styles.featuredOverlay}>
                <h3 className={styles.featuredTitle}>{featuredProject.title}</h3>
                <div className={styles.featuredStats}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiHeart /> {featuredProject.likes}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiEye /> {(featuredProject.views / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>
            </div>

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
