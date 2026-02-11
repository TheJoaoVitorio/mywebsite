import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer' // Click outside to close
            }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    zIndex: 1001
                }}
            >
                <FiX />
            </button>
            <div
                style={{ maxWidth: '90%', maxHeight: '90%' }}
                onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing
            >
                <img
                    src={imageUrl}
                    alt="Full View"
                    style={{
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        display: 'block',
                        borderRadius: '4px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                />
            </div>
        </div>
    );
}
