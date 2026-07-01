import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiStar, FiAward } from 'react-icons/fi';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await API.get('/trainers');
      setTrainers(data.data);
    } catch (error) { console.error('Failed to fetch trainers'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <section className="bg-dark-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Meet Our Trainers</h1>
          <p className="text-dark-300">Expert guidance for your fitness journey</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">Loading trainers...</div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-12 text-dark-500">No trainers available yet</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {trainers.map(trainer => (
                <div key={trainer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="bg-gradient-to-r from-dark-700 to-dark-900 p-8 text-center text-white">
                    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">{trainer.name?.charAt(0) || 'T'}</span>
                    </div>
                    <h3 className="text-xl font-bold">{trainer.name}</h3>
                    <p className="text-dark-300 text-sm">{trainer.email}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`w-4 h-4 ${i < Math.round(trainer.rating) ? 'text-yellow-400 fill-current' : 'text-dark-300'}`} />
                      ))}
                      <span className="text-sm text-dark-500 ml-1">({trainer.rating})</span>
                    </div>
                    {trainer.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {trainer.specialties.map((s, i) => (
                          <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">{s}</span>
                        ))}
                      </div>
                    )}
                    {trainer.bio && <p className="text-sm text-dark-500">{trainer.bio}</p>}
                    <div className="mt-4 flex items-center gap-4 text-sm text-dark-500">
                      <span className="flex items-center gap-1"><FiAward className="w-4 h-4" /> {trainer.yearsExperience || 0} yrs exp</span>
                      <span>${trainer.hourlyRate}/hr</span>
                    </div>
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
