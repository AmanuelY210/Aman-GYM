import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">F</span>
              </div>
              <span className="text-xl font-bold">FitZone</span>
            </div>
            <p className="text-dark-400 text-sm">Transform your body, transform your life. Join the FitZone community today.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/classes" className="block text-dark-400 hover:text-white text-sm">Classes</Link>
              <Link to="/trainers" className="block text-dark-400 hover:text-white text-sm">Trainers</Link>
              <Link to="/about" className="block text-dark-400 hover:text-white text-sm">About Us</Link>
              <Link to="/contact" className="block text-dark-400 hover:text-white text-sm">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <div className="space-y-2">
              <span className="block text-dark-400 text-sm">Yoga Classes</span>
              <span className="block text-dark-400 text-sm">HIIT Training</span>
              <span className="block text-dark-400 text-sm">Strength Training</span>
              <span className="block text-dark-400 text-sm">Cardio Sessions</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-dark-400 text-sm">
              <p>123 Fitness Street</p>
              <p>New York, NY 10001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@fitzone.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-500 text-sm">
          &copy; {new Date().getFullYear()} FitZone Gym. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
