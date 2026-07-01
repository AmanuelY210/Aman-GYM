import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Message sent! We will get back to you soon.'); setFormData({ name: '', email: '', subject: '', message: '' }); };

  return (
    <div>
      <section className="bg-dark-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-dark-300">Have questions? We would love to hear from you.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4"><FiMapPin className="w-6 h-6 text-primary-600" /></div>
              <h3 className="font-semibold text-dark-800 mb-2">Address</h3>
              <p className="text-dark-500 text-sm">123 Fitness Street<br />New York, NY 10001</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4"><FiPhone className="w-6 h-6 text-primary-600" /></div>
              <h3 className="font-semibold text-dark-800 mb-2">Phone</h3>
              <p className="text-dark-500 text-sm">(555) 123-4567</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4"><FiMail className="w-6 h-6 text-primary-600" /></div>
              <h3 className="font-semibold text-dark-800 mb-2">Email</h3>
              <p className="text-dark-500 text-sm">info@fitzone.com</p>
            </div>
          </div>
          <div className="mt-12 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-5">
              <h2 className="text-2xl font-bold text-dark-800">Send us a Message</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-medium text-dark-700 mb-1">Name</label><input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-dark-700 mb-1">Email</label><input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
              </div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Subject</label><input type="text" className="input-field" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Message</label><textarea className="input-field" rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required /></div>
              <button type="submit" className="btn-primary flex items-center gap-2"><FiSend className="w-4 h-4" /> Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}