import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, title, onClose }) => (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="w-full max-w-sm bg-gray-900 border border-green-500/30 rounded-2xl shadow-2xl shadow-green-900/50 p-6 relative">
      <h3 className="text-xl font-orbitron text-center text-green-300 mb-6">{title}</h3>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
        <X size={24} />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;