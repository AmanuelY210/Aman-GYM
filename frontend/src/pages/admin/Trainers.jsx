import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({ user: '', specialties: '', hourlyRate: '', bio: '', yearsExperience: '' });

  useEffect(() => { fetchTrainers(); fetchUsers(); }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await API.get('/trainers?limit=100');
      setTrainers(data.data);
    } catch (error) { toast.error('Failed to load trainers'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users?role=trainer');
      setUsers(data.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean), hourlyRate: Number(formData.hourlyRate), yearsExperience: Number(formData.yearsExperience) || 0 };
      if (editingTrainer) {
        await API.put(`/trainers/${editingTrainer.id}`, payload);
        toast.success('Trainer updated!');
      } else {
        await API.post('/trainers', payload);
        toast.success('Trainer created!');
      }
      setShowModal(false);
      setFormData({ user: '', specialties: '', hourlyRate: '', bio: '', yearsExperience: '' });
      fetchTrainers();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this trainer?')) return;
    try {
      await API.delete(`/trainers/${id}`);
      toast.success('Trainer deleted!');
      fetchTrainers();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Specialties', accessor: 'specialties', render: (val) => Array.isArray(val) ? val.join(', ') : (val || 'N/A') },
    { header: 'Rate', accessor: 'hourlyRate', render: (val) => `$${val}/hr` },
    { header: 'Rating', accessor: 'rating', render: (val) => `${val}/5` },
    { header: 'Experience', accessor: 'yearsExperience', render: (val) => `${val} yrs` },
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); setEditingTrainer(row); setFormData({ user: row.userId || '', specialties: Array.isArray(row.specialties) ? row.specialties.join(', ') : (row.specialties || ''), hourlyRate: row.hourlyRate || '', bio: row.bio || '', yearsExperience: row.yearsExperience || '' }); setShowModal(true); }} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-red-600 hover:text-red-800"><FiTrash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-800">Trainers</h1>
        <Button onClick={() => { setEditingTrainer(null); setFormData({ user: '', specialties: '', hourlyRate: '', bio: '', yearsExperience: '' }); setShowModal(true); }}><FiPlus className="w-4 h-4" /> Add Trainer</Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? <div className="p-8 text-center">Loading...</div> : <Table columns={columns} data={trainers} />}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTrainer ? 'Edit Trainer' : 'Add Trainer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingTrainer && (
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">User Account</label>
              <select className="input-field" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} required>
                <option value="">Select a user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
          )}
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Specialties (comma separated)</label><input type="text" className="input-field" value={formData.specialties} onChange={(e) => setFormData({ ...formData, specialties: e.target.value })} placeholder="e.g. Yoga, HIIT, Strength" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Hourly Rate ($)</label><input type="number" className="input-field" value={formData.hourlyRate} onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Years Experience</label><input type="number" className="input-field" value={formData.yearsExperience} onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })} /></div>
          </div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Bio</label><textarea className="input-field" rows="3" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} /></div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editingTrainer ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
