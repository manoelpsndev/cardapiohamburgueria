import { useEffect } from 'react';

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
}

export function ImageModal({ imageUrl, isOpen, onClose, alt = "Imagem do produto" }: ImageModalProps) {
  
  // Fechar com tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full"
        onClick={e => e.stopPropagation()} // Impede fechar ao clicar na imagem
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
        >
          ×
        </button>
        
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto rounded-lg shadow-2xl"
        />
        
        <p className="text-center text-white/70 mt-4 text-sm">
          Clique fora da imagem para fechar
        </p>
      </div>
    </div>
  );
}