import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import AdminLayout from './components/Layout/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Classes from './pages/public/Classes';
import Trainers from './pages/public/Trainers';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import BookClass from './pages/member/BookClass';
import MyBookings from './pages/member/MyBookings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminTrainers from './pages/admin/Trainers';
import AdminClasses from './pages/admin/Classes';
import AdminPlans from './pages/admin/Plans';
import AdminPayments from './pages/admin/Payments';
import AdminSettings from './pages/admin/Settings';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/classes" element={<PublicLayout><Classes /></PublicLayout>} />
      <Route path="/trainers" element={<PublicLayout><Trainers /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Auth Routes */}
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* Member Routes */}
      <Route path="/member" element={<ProtectedRoute roles={['member']}><PublicLayout><MemberDashboard /></PublicLayout></ProtectedRoute>} />
      <Route path="/member/profile" element={<ProtectedRoute roles={['member']}><PublicLayout><MemberProfile /></PublicLayout></ProtectedRoute>} />
      <Route path="/member/book" element={<ProtectedRoute roles={['member']}><PublicLayout><BookClass /></PublicLayout></ProtectedRoute>} />
      <Route path="/member/bookings" element={<ProtectedRoute roles={['member']}><PublicLayout><MyBookings /></PublicLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/members" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminMembers /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/trainers" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminTrainers /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminClasses /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/plans" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminPlans /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
