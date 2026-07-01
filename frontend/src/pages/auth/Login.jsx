import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'member') navigate('/member');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-800">Welcome Back</h1>
          <p className="text-dark-500 mt-2">Sign in to your FitZone account</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-dark-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-dark-400" />
                <input
                  type="password"
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              <FiLogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-dark-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
