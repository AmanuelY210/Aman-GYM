import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSave, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [password, setPassword] = useState({ new: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-dark-800 mb-8">Settings</h1>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-xl font-semibold text-dark-800 mb-6 flex items-center gap-2">
          <FiUser className="w-5 h-5 text-primary-600" /> Profile Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-dark-400" />
              <input
                type="text"
                className="input-field pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-dark-400" />
              <input
                type="email"
                className="input-field pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-dark-400" />
              <input
                type="tel"
                className="input-field pl-10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <span className="text-sm text-dark-400">Role: <span className="font-medium text-dark-600 capitalize">{user?.role}</span></span>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-dark-800 mb-6 flex items-center gap-2">
          <FiLock className="w-5 h-5 text-primary-600" /> Account Info
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-dark-100">
            <span className="text-dark-500">Account ID</span>
            <span className="font-medium text-dark-700">#{user?.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-100">
            <span className="text-dark-500">Email</span>
            <span className="font-medium text-dark-700">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-100">
            <span className="text-dark-500">Role</span>
            <span className="font-medium text-dark-700 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
