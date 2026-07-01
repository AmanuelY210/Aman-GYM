import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiUsers, FiCalendar, FiStar } from 'react-icons/fi';

export default function Home() {
  const features = [
    { icon: FiActivity, title: 'Modern Equipment', desc: 'State-of-the-art machines and free weights for every workout style.' },
    { icon: FiUsers, title: 'Expert Trainers', desc: 'Certified professionals to guide your fitness journey.' },
    { icon: FiCalendar, title: 'Flexible Classes', desc: 'Over 50 weekly classes to fit any schedule.' },
    { icon: FiStar, title: 'Premium Facilities', desc: 'Sauna, pool, and recovery zone included.' },
  ];
  const stats = [
    { value: '5000+', label: 'Active Members' },
    { value: '50+', label: 'Weekly Classes' },
    { value: '20+', label: 'Expert Trainers' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];
  return (
    <div>
      <section className="relative bg-dark-900 text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-dark-800"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Transform Your Body,<br /><span className="text-primary-500">Transform Your Life</span></h1>
            <p className="text-xl text-dark-300 mb-8">Join FitZone and start your fitness journey with world-class equipment, expert trainers, and a supportive community.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">Start Free Trial <FiArrowRight /></Link>
              <Link to="/classes" className="border-2 border-dark-500 text-white hover:border-primary-500 px-8 py-3 rounded-lg transition font-semibold">View Classes</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center text-white">
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-primary-200 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-800">Why Choose FitZone?</h2>
            <p className="text-dark-500 mt-2">Everything you need for a complete fitness experience</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-dark-800 mb-2">{feat.title}</h3>
                <p className="text-sm text-dark-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-dark-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-dark-300 mb-8 text-lg">Join thousands of members who have transformed their lives with FitZone.</p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">Get Started Today <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}