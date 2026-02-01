import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '40px', color: '#fff', minHeight: '100vh', backgroundColor: '#121212' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#c9d1d9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '20px'
                }}
            >
                <FiArrowLeft /> Voltar
            </button>
            <h1>Detalhes do Projeto {id}</h1>
            <p>Mock de detalhes do projeto. Futuramente integração com Supabase.</p>
        </div>
    );
}
