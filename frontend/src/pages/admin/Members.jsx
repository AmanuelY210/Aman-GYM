import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { FiEdit2 } from 'react-icons/fi';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({ status: 'active' });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await API.get('/members?limit=100');
      setMembers(data.data);
    } catch (error) { toast.error('Failed to load members'); }
    finally { setLoading(false); }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setFormData({ status: member.status });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/members/${selectedMember.id}`, formData);
      toast.success('Member updated!');
      setShowModal(false);
      fetchMembers();
    } catch (error) { toast.error('Failed to update member'); }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'status', render: (val) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${val === 'active' ? 'bg-green-100 text-green-700' : val === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{val}</span> },
    { header: 'Plan', accessor: 'planName', render: (val) => val || 'No Plan' },
    { header: 'Joined', accessor: 'createdAt', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="w-4 h-4" /></button>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-800">Members</h1>
        <span className="text-dark-500">{members.length} total members</span>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? <div className="p-8 text-center">Loading...</div> : <Table columns={columns} data={members} />}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Member">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Status</label>
            <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
