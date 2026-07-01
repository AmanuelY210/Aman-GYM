import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatsCard from '../../components/UI/StatsCard';
import { FiUsers, FiUserCheck, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/dashboard');
      setStats(data.data);
    } catch (error) { console.error('Failed to fetch stats', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-800 mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Members" value={stats?.totalMembers || 0} icon={FiUsers} color="primary" />
        <StatsCard title="Active Trainers" value={stats?.totalTrainers || 0} icon={FiUserCheck} color="green" />
        <StatsCard title="Total Classes" value={stats?.totalClasses || 0} icon={FiCalendar} color="purple" />
        <StatsCard title="Total Revenue" value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} icon={FiDollarSign} color="yellow" />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">Revenue by Month</h3>
          {stats?.monthlyRevenue?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyRevenue.map(m => ({ name: `${m.month}/${m.year}`, revenue: m.total }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(val) => `$${val}`} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-center py-8">No revenue data yet</p>}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">Members by Plan</h3>
          {stats?.membersByPlan?.filter(p => p.count > 0).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.membersByPlan.filter(p => p.count > 0).map(p => ({ name: p.planName || 'Unassigned', value: p.count }))} cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {stats.membersByPlan.filter(p => p.count > 0).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-center py-8">No plan data yet</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {stats?.recentBookings?.length > 0 ? stats.recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div><p className="font-medium text-dark-800">{b.className}</p><p className="text-xs text-dark-500">{b.memberName || 'Member'} - {b.trainerName}</p></div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{b.status}</span>
              </div>
            )) : <p className="text-dark-500 text-center py-4">No bookings yet</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {stats?.recentPayments?.length > 0 ? stats.recentPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div><p className="font-medium text-dark-800">${p.amount}</p><p className="text-xs text-dark-500">{p.invoiceNumber} - {p.memberName}</p></div>
                <span className={`text-xs px-2 py-1 rounded ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
              </div>
            )) : <p className="text-dark-500 text-center py-4">No payments yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
