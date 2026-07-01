import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2 } from 'react-icons/fi';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({ member: '', amount: '', type: 'membership', paymentMethod: 'card', status: 'pending', description: '' });

  useEffect(() => { fetchPayments(); fetchMembers(); }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await API.get('/payments?limit=100');
      setPayments(data.data);
      setTotalRevenue(data.totalRevenue);
    } catch (error) { toast.error('Failed to load payments'); }
    finally { setLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await API.get('/members?limit=100');
      setMembers(data.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: Number(formData.amount), memberId: Number(formData.member) };
      if (editingPayment) {
        await API.put(`/payments/${editingPayment.id}`, payload);
        toast.success('Payment updated!');
      } else {
        await API.post('/payments', payload);
        toast.success('Payment created!');
      }
      setShowModal(false);
      setFormData({ member: '', amount: '', type: 'membership', paymentMethod: 'card', status: 'pending', description: '' });
      fetchPayments();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-blue-100 text-blue-700' };

  const columns = [
    { header: 'Invoice', accessor: 'invoiceNumber' },
    { header: 'Member', accessor: 'memberName' },
    { header: 'Amount', accessor: 'amount', render: (val) => `$${val}` },
    { header: 'Type', accessor: 'type', render: (val) => <span className="capitalize">{val?.replace('-', ' ')}</span> },
    { header: 'Method', accessor: 'paymentMethod', render: (val) => <span className="capitalize">{val}</span> },
    { header: 'Status', accessor: 'status', render: (val) => <span className={`text-xs px-2 py-1 rounded ${statusColors[val] || ''}`}>{val}</span> },
    { header: 'Date', accessor: 'createdAt', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      <button onClick={(e) => { e.stopPropagation(); setEditingPayment(row); setFormData({ member: row.memberId || '', amount: row.amount, type: row.type, paymentMethod: row.paymentMethod, status: row.status, description: row.description || '' }); setShowModal(true); }} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="w-4 h-4" /></button>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">Payments</h1>
          <p className="text-dark-500">Total Revenue: <span className="font-semibold text-green-600">${totalRevenue.toLocaleString()}</span></p>
        </div>
        <Button onClick={() => { setEditingPayment(null); setFormData({ member: '', amount: '', type: 'membership', paymentMethod: 'card', status: 'pending', description: '' }); setShowModal(true); }}><FiPlus className="w-4 h-4" /> Add Payment</Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? <div className="p-8 text-center">Loading...</div> : <Table columns={columns} data={payments} />}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPayment ? 'Edit Payment' : 'Record Payment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingPayment && (
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Member</label><select className="input-field" value={formData.member} onChange={(e) => setFormData({ ...formData, member: e.target.value })} required><option value="">Select member</option>{members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Amount ($)</label><input type="number" className="input-field" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Type</label><select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>{['membership', 'class', 'personal-training', 'merchandise'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Payment Method</label><select className="input-field" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>{['cash', 'card', 'bank-transfer', 'online'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-dark-700 mb-1">Status</label><select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>{['pending', 'completed', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1">Description</label><input type="text" className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editingPayment ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
