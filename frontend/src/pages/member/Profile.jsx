import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

export default function MemberProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', weight: '', height: '', fitnessGoals: '', medicalConditions: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/members/me');
      setProfile(data.data);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: data.data?.dateOfBirth?.split('T')[0] || '',
        gender: data.data?.gender || '',
        weight: data.data?.weight || '',
        height: data.data?.height || '',
        fitnessGoals: data.data?.fitnessGoals?.join(', ') || '',
        medicalConditions: data.data?.medicalConditions || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', { name: formData.name, phone: formData.phone });
      await API.put('/members/me', {
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        fitnessGoals: formData.fitnessGoals ? formData.fitnessGoals.split(',').map(g => g.trim()) : [],
        medicalConditions: formData.medicalConditions,
      });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-dark-800 mb-8">My Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
            <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
            <input type="email" className="input-field" value={formData.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
            <input type="tel" className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Date of Birth</label>
            <input type="date" className="input-field" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Gender</label>
            <select className="input-field" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Weight (kg)</label>
            <input type="number" className="input-field" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Height (cm)</label>
            <input type="number" className="input-field" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">Fitness Goals (comma separated)</label>
          <input type="text" className="input-field" value={formData.fitnessGoals} onChange={(e) => setFormData({ ...formData, fitnessGoals: e.target.value })} placeholder="e.g. Lose weight, Build muscle" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">Medical Conditions</label>
          <textarea className="input-field" rows="3" value={formData.medicalConditions} onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <FiSave className="w-4 h-4" /> Save Changes
        </button>
      </form>
    </div>
  );
}
