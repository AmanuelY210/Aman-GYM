import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus } from 'react-icons/fi';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const user = await register({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone });
      toast.success('Welcome to FitZone!');
      navigate('/member');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-800">Join FitZone</h1>
          <p className="text-dark-500 mt-2">Start your fitness journey today</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-dark-400" />
                <input type="text" className="input-field pl-10" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-dark-400" />
                <input type="email" className="input-field pl-10" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-dark-400" />
                <input type="tel" className="input-field pl-10" placeholder="Enter your phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-dark-400" />
                <input type="password" className="input-field pl-10" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-dark-400" />
                <input type="password" className="input-field pl-10" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
              <FiUserPlus className="w-5 h-5" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-dark-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
