import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/theme-toggle/ThemeToggle'
import Home from './pages/home/Home.tsx'
import ProtectedRoute from './components/protected-route/ProtectedRoute';

const ProjectDetails = lazy(() => import('./pages/project-details/ProjectDetails'));
const Login = lazy(() => import('./pages/login/Login'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const Utils = lazy(() => import('./pages/utils/Utils'));
const Apps = lazy(() => import('./pages/apps/Apps'));
const CalculadoraServico = lazy(() => import('./pages/utils/tools/calculadora-servico/CalculadoraServico'));
const Palavritas = lazy(() => import('./pages/palavritas/Palavritas.tsx'));
const Files = lazy(() => import('./pages/files/Files.tsx'));

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll smoothly on route transition
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="route-wrapper">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/apps"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando aplicativos...</div>}>
              <Apps />
            </Suspense>
          }
        />
        <Route
          path="/files"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando arquivos...</div>}>
              <Files />
            </Suspense>
          }
        />
        <Route
          path="/utils"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Loading tools...</div>}>
              <Utils />
            </Suspense>
          }
        />
        <Route
          path="/tools/calculadora-servico"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando calculadora...</div>}>
              <CalculadoraServico />
            </Suspense>
          }
        />
        <Route
          path="/project/:id"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando...</div>}>
              <ProjectDetails />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando...</div>}>
              <Login />
            </Suspense>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando...</div>}>
                <Admin />
              </Suspense>
            }
          />
        </Route>
        
        <Route
          path="/utils/palavritas"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: 'var(--text-primary)' }}>Carregando jogo...</div>}>
              <Palavritas />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ThemeToggle />
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
