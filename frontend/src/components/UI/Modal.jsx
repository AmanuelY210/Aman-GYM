import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-dark-900 bg-opacity-75" onClick={onClose} />
        <div className={`relative w-full ${sizes[size]} mx-auto overflow-hidden bg-white rounded-xl shadow-xl`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200">
            <h3 className="text-lg font-semibold text-dark-800">{title}</h3>
            <button onClick={onClose} className="text-dark-400 hover:text-dark-600">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
