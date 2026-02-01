import Header from '../../components/header/header'
import ProfileCard from '../../components/profile-card/ProfileCard'
import styles from './Home.module.css'

function App() {

  return (
    <div className={styles.container}>
      {/* <Header /> */}
      <main className={styles.mainContent}>
        <div className={styles.profileSection}>
          <ProfileCard />
        </div>
        <div className={styles.contentSection}>
          <h1>Bem vindo ao meu portfólio</h1>
          <p>Aqui você encontrará meus projetos e experiências.</p>
        </div>
      </main>
    </div>
  )
}

export default App
