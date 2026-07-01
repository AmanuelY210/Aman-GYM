import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiUsers, FiUserCheck, FiCalendar, FiCreditCard,
  FiSettings, FiLogOut, FiDollarSign, FiActivity
} from 'react-icons/fi';

const menuItems = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/admin/members', icon: FiUsers, label: 'Members' },
  { to: '/admin/trainers', icon: FiUserCheck, label: 'Trainers' },
  { to: '/admin/classes', icon: FiCalendar, label: 'Classes' },
  { to: '/admin/plans', icon: FiActivity, label: 'Plans' },
  { to: '/admin/payments', icon: FiCreditCard, label: 'Payments' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-dark-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-dark-700">
        <NavLink to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">F</span>
          </div>
          <div>
            <span className="text-lg font-bold">FitZone</span>
            <p className="text-xs text-dark-400">Admin Panel</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-700">
        <NavLink to="/" className="sidebar-link mb-2">
          <FiHome className="w-5 h-5" />
          <span>View Site</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
