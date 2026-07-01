import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '', features: '' });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await API.get('/plans/all');
      setPlans(data.data);
    } catch (error) { toast.error('Failed to load plans'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price), duration: Number(formData.duration), features: formData.features.split(',').map(f => f.trim()).filter(Boolean) };
      if (editingPlan) {
        await API.put(`/plans/${editingPlan.id}`, payload);
        toast.success('Plan updated!');
      } else {
        await API.post('/plans', payload);
        toast.success('Plan created!');
      }
      setShowModal(false);
      setFormData({ name: '', description: '', price: '', duration: '', features: '' });
      fetchPlans();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this plan?')) return;
    try {
      await API.delete(`/plans/${id}`);
      toast.success('Plan deactivated!');
      fetchPlans();
    } catch (error) { toast.error('Failed'); }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Price', accessor: 'price', render: (val) => `$${val}` },
    { header: 'Duration', accessor: 'duration', render: (val) => `${val} days` },
    { header: 'Features', accessor: 'features', render: (val) => Array.isArray(val) ? val.slice(0, 3).join(', ') + (val.length > 3 ? '...' : '') : 'N/A' },
    { header: 'Status', accessor: 'isActive', render: (val) => <span className={`text-xs px-2 py-1 rounded ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{val ? 'Active' : 'Inactive'}</span> },
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); setEditingPlan(row); setFormData({ name: row.name, description: row.description || '', price: row.price, duration: row.duration, features: Array.isArray(row.features) ? row.features.join(', ') : '' }); setShowModal(true); }} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-red-600 hover:text-red-800"><FiTrash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-800">Membership Plans</h1>
        <Button onClick={() => { setEditingPlan(null); setFormData({ name: '', description: '', price: '', duration: '', features: '' }); setShowModal(true); }}><FiPlus className="w-4 h-4" /> Add Plan</Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? <div className="p-8 text-center">Loading...</div> : <Table columns={columns} data={plans} />}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPlan ? 'Edit Plan' : 'Add Plan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Plan Name</label><input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Description</label><textarea className="input-field" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Price ($)</label><input type="number" className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Duration (days)</label><input type="number" className="input-field" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required /></div>
          </div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Features (comma separated)</label><input type="text" className="input-field" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="e.g. Unlimited classes, Personal trainer" /></div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editingPlan ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
