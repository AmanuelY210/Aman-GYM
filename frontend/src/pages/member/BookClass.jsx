import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiClock, FiCalendar, FiCheck } from 'react-icons/fi';

export default function BookClass() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await API.get('/classes');
      setClasses(data.data);
    } catch (error) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (classId) => {
    setBooking(classId);
    try {
      await API.post('/bookings', { classId, date: new Date().toISOString() });
      toast.success('Class booked successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book class');
    } finally {
      setBooking(null);
    }
  };

  const categories = ['all', 'yoga', 'cardio', 'strength', 'hiit', 'pilates', 'dance'];
  const filtered = filter === 'all' ? classes : classes.filter(c => c.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-dark-800 mb-2">Book a Class</h1>
      <p className="text-dark-500 mb-8">Choose from our wide range of fitness classes</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'}`}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading classes...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cls => (
            <div key={cls.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded capitalize">{cls.category}</span>
                  <h3 className="text-lg font-semibold text-dark-800 mt-2">{cls.name}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${cls.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : cls.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {cls.difficulty}
                </span>
              </div>
              <p className="text-sm text-dark-500 mb-4 line-clamp-2">{cls.description}</p>
              <div className="flex items-center gap-4 text-sm text-dark-600 mb-4">
                <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> {cls.duration} min</span>
              </div>
              {cls.schedule?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-dark-400 mb-1">Available times:</p>
                  <div className="flex flex-wrap gap-1">
                    {cls.schedule.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs bg-dark-100 text-dark-600 px-2 py-1 rounded">{s.day} {s.startTime}</span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => handleBook(cls.id)} disabled={booking === cls.id} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                {booking === cls.id ? 'Booking...' : <><FiCheck className="w-4 h-4" /> Book Now</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
