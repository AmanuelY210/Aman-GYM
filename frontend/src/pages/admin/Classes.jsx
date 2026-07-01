import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', trainer: '', category: 'yoga', difficulty: 'beginner', duration: 60, price: 0 });

  useEffect(() => { fetchClasses(); fetchTrainers(); }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await API.get('/classes?limit=100');
      setClasses(data.data);
    } catch (error) { toast.error('Failed to load classes'); }
    finally { setLoading(false); }
  };

  const fetchTrainers = async () => {
    try {
      const { data } = await API.get('/trainers?limit=100');
      setTrainers(data.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, trainerId: formData.trainer, duration: Number(formData.duration), price: Number(formData.price), schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', maxCapacity: 20 }] };
      if (editingClass) {
        await API.put(`/classes/${editingClass.id}`, payload);
        toast.success('Class updated!');
      } else {
        await API.post('/classes', payload);
        toast.success('Class created!');
      }
      setShowModal(false);
      setFormData({ name: '', description: '', trainer: '', category: 'yoga', difficulty: 'beginner', duration: 60, price: 0 });
      fetchClasses();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await API.delete(`/classes/${id}`);
      toast.success('Class deleted!');
      fetchClasses();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Trainer', accessor: 'trainerName' },
    { header: 'Category', accessor: 'category', render: (val) => <span className="capitalize">{val}</span> },
    { header: 'Difficulty', accessor: 'difficulty', render: (val) => <span className={`text-xs px-2 py-1 rounded ${val === 'beginner' ? 'bg-green-100 text-green-700' : val === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{val}</span> },
    { header: 'Duration', accessor: 'duration', render: (val) => `${val} min` },
    { header: 'Price', accessor: 'price', render: (val) => val === 0 ? 'Free' : `$${val}` },
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); setEditingClass(row); setFormData({ name: row.name, description: row.description || '', trainer: row.trainerId || '', category: row.category, difficulty: row.difficulty, duration: row.duration, price: row.price }); setShowModal(true); }} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-red-600 hover:text-red-800"><FiTrash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-800">Classes</h1>
        <Button onClick={() => { setEditingClass(null); setFormData({ name: '', description: '', trainer: '', category: 'yoga', difficulty: 'beginner', duration: 60, price: 0 }); setShowModal(true); }}><FiPlus className="w-4 h-4" /> Add Class</Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? <div className="p-8 text-center">Loading...</div> : <Table columns={columns} data={classes} />}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingClass ? 'Edit Class' : 'Add Class'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Class Name</label><input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Description</label><textarea className="input-field" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Trainer</label><select className="input-field" value={formData.trainer} onChange={(e) => setFormData({ ...formData, trainer: e.target.value })} required><option value="">Select trainer</option>{trainers.map(t => <option key={t.id} value={t.trainerId || t.id}>{t.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Category</label><select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>{['yoga','cardio','strength','hiit','pilates','dance','martial-arts','other'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Difficulty</label><select className="input-field" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}>{['beginner','intermediate','advanced'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Duration (min)</label><input type="number" className="input-field" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Price ($)</label><input type="number" className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editingClass ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
