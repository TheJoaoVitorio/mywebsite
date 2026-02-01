import ProfileCard from '../../components/profile-card/ProfileCard'
import styles from './Home.module.css'

function App() {

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
        </div>
      </main>
    </div>
  )
}

export default App
