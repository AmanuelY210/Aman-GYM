import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiBookOpen, FiUser } from 'react-icons/fi';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([API.get('/members/me'), API.get('/bookings/my')]);
      setProfile(profileRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (error) { console.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date()).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-800">Welcome, {user?.name}!</h1>
        <p className="text-dark-500">Manage your fitness journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/member/profile" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-lg"><FiUser className="w-6 h-6 text-primary-600" /></div>
          <div><p className="text-sm text-dark-500">My Profile</p><p className="font-semibold text-dark-800">View Profile</p></div>
        </Link>
        <Link to="/member/book" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><FiCalendar className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-sm text-dark-500">Classes</p><p className="font-semibold text-dark-800">Book a Class</p></div>
        </Link>
        <Link to="/member/bookings" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg"><FiBookOpen className="w-6 h-6 text-purple-600" /></div>
          <div><p className="text-sm text-dark-500">Bookings</p><p className="font-semibold text-dark-800">{bookings.length} Total</p></div>
        </Link>
      </div>

      {profile && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-dark-800 mb-4">Membership Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-dark-50 rounded-lg">
              <p className="text-sm text-dark-500">Status</p>
              <p className={`font-semibold ${profile.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{profile.status?.toUpperCase()}</p>
            </div>
            <div className="p-4 bg-dark-50 rounded-lg">
              <p className="text-sm text-dark-500">Plan</p>
              <p className="font-semibold text-dark-800">{profile.planName || 'No Plan'}</p>
            </div>
            <div className="p-4 bg-dark-50 rounded-lg">
              <p className="text-sm text-dark-500">Expires</p>
              <p className="font-semibold text-dark-800">{profile.membershipEndDate ? new Date(profile.membershipEndDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-dark-800 mb-4">Upcoming Bookings</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-dark-500">No upcoming bookings. <Link to="/member/book" className="text-primary-600 hover:underline">Book a class now!</Link></p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
                <div>
                  <p className="font-semibold text-dark-800">{booking.className}</p>
                  <p className="text-sm text-dark-500">{new Date(booking.date).toLocaleDateString()} - {booking.trainerName}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Confirmed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
