import { FiTarget, FiHeart, FiTrendingUp } from 'react-icons/fi';

export default function About() {
  return (
    <div>
      <section className="bg-dark-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About FitZone</h1>
          <p className="text-dark-300 text-lg max-w-2xl">Your trusted partner in fitness since 2020. We believe everyone deserves access to world-class fitness facilities and expert guidance.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTarget className="w-8 h-8 text-primary-600" /></div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-dark-500">To make fitness accessible, enjoyable, and effective for everyone, regardless of their experience level.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiHeart className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-xl font-semibold mb-2">Our Values</h3>
              <p className="text-dark-500">Community, dedication, and excellence drive everything we do. Your goals are our goals.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrendingUp className="w-8 h-8 text-purple-600" /></div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-dark-500">To be the leading fitness community that inspires lifelong health and wellness transformation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}