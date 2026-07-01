import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-dark-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
