import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiClock, FiUsers } from 'react-icons/fi';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await API.get('/classes');
      setClasses(data.data);
    } catch (error) { console.error('Failed to fetch classes'); }
    finally { setLoading(false); }
  };

  const categories = ['all', 'yoga', 'cardio', 'strength', 'hiit', 'pilates', 'dance', 'martial-arts'];
  const filtered = filter === 'all' ? classes : classes.filter(c => c.category === filter);

  return (
    <div>
      <section className="bg-dark-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Classes</h1>
          <p className="text-dark-300">Find the perfect class for your fitness goals</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'}`}>
                {cat === 'all' ? 'All' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-12">Loading classes...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-dark-500">No classes found</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filtered.map(cls => (
                <div key={cls.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">{cls.difficulty}</span>
                    <h3 className="text-xl font-bold mt-2">{cls.name}</h3>
                    <p className="text-primary-100 text-sm capitalize">{cls.category?.replace('-', ' ')}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-dark-500 text-sm mb-4">{cls.description}</p>
                    <div className="flex items-center justify-between text-sm text-dark-600">
                      <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> {cls.duration} min</span>
                      <span className="flex items-center gap-1"><FiUsers className="w-4 h-4" /> {cls.schedule?.[0]?.maxCapacity || 20} spots</span>
                    </div>
                    {cls.trainerName && (
                      <p className="text-xs text-dark-400 mt-2">Trainer: {cls.trainerName}</p>
                    )}
                    {cls.schedule?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dark-100">
                        <p className="text-xs text-dark-400 mb-1">Schedule:</p>
                        <div className="flex flex-wrap gap-1">
                          {cls.schedule.map((s, i) => (
                            <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">{s.day} {s.startTime}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {cls.price > 0 && (
                      <p className="text-sm font-semibold text-primary-600 mt-2">${cls.price} per class</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
