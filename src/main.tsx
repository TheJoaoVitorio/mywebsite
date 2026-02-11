import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Home from './pages/home/Home.tsx'
import ProtectedRoute from './components/protected-route/ProtectedRoute';

const ProjectDetails = lazy(() => import('./pages/project-details/ProjectDetails'));
const Login = lazy(() => import('./pages/login/Login'));
const Admin = lazy(() => import('./pages/admin/Admin'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/project/:id"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: '#fff' }}>Carregando...</div>}>
              <ProjectDetails />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: '#fff' }}>Carregando...</div>}>
              <Login />
            </Suspense>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', color: '#fff' }}>Carregando...</div>}>
                <Admin />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
