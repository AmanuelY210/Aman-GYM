import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiCalendar, FiX, FiClock } from 'react-icons/fi';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data.data);
    } catch (error) { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) { toast.error('Failed to cancel booking'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    'no-show': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-dark-800 mb-2">My Bookings</h1>
      <p className="text-dark-500 mb-8">View and manage your class bookings</p>

      <div className="flex gap-2 mb-6">
        {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-primary-600 text-white' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-dark-500">No bookings found</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-800">{booking.className}</h3>
                  <p className="text-sm text-dark-500 flex items-center gap-2">
                    <FiClock className="w-3 h-3" /> {new Date(booking.date).toLocaleDateString()}
                  </p>
                  {booking.trainerName && (
                    <p className="text-xs text-dark-400">Trainer: {booking.trainerName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>{booking.status}</span>
                {booking.status === 'confirmed' && (
                  <button onClick={() => handleCancel(booking.id)} className="text-red-500 hover:text-red-700 p-2">
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
