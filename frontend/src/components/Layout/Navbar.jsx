import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold">FitZone</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-dark-300 hover:text-white transition">Home</Link>
            <Link to="/classes" className="text-dark-300 hover:text-white transition">Classes</Link>
            <Link to="/trainers" className="text-dark-300 hover:text-white transition">Trainers</Link>
            <Link to="/about" className="text-dark-300 hover:text-white transition">About</Link>
            <Link to="/contact" className="text-dark-300 hover:text-white transition">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-primary-400 hover:text-primary-300 transition">Admin Panel</Link>
                )}
                {user.role === 'member' && (
                  <Link to="/member" className="text-primary-400 hover:text-primary-300 transition">Dashboard</Link>
                )}
                <div className="flex items-center gap-2 text-dark-300">
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-dark-400 hover:text-red-400 transition">
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-dark-300 hover:text-white transition">Login</Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition">Join Now</Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block py-2 text-dark-300 hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/classes" className="block py-2 text-dark-300 hover:text-white" onClick={() => setIsOpen(false)}>Classes</Link>
            <Link to="/trainers" className="block py-2 text-dark-300 hover:text-white" onClick={() => setIsOpen(false)}>Trainers</Link>
            <Link to="/about" className="block py-2 text-dark-300 hover:text-white" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="block py-2 text-dark-300 hover:text-white" onClick={() => setIsOpen(false)}>Contact</Link>
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="block py-2 text-primary-400" onClick={() => setIsOpen(false)}>Admin Panel</Link>}
                {user.role === 'member' && <Link to="/member" className="block py-2 text-primary-400" onClick={() => setIsOpen(false)}>Dashboard</Link>}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block py-2 text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-dark-300 hover:text-white" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-primary-400" onClick={() => setIsOpen(false)}>Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
