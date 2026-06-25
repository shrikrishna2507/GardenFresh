import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all fields')
    setLoading(true)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.")
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1200)
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-16">
        <div className="page-container text-center">
          <h1 className="text-4xl font-black mb-3">Contact Us</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">Have a question, suggestion, or want to partner with us? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">Get in Touch</h2>
              {[
                { icon: <FiMail className="text-green-600 text-xl" />, label: 'Email', value: 'support@gardenfresh.in', href: 'mailto:support@gardenfresh.in' },
                { icon: <FiPhone className="text-green-600 text-xl" />, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: <FiMapPin className="text-green-600 text-xl" />, label: 'Location', value: 'Udupi, Karnataka 576101', href: null },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">{c.label}</p>
                    {c.href
                      ? <a href={c.href} className="text-gray-800 font-medium hover:text-green-600 transition-colors">{c.value}</a>
                      : <p className="text-gray-800 font-medium">{c.value}</p>}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Working Hours</p>
                <p className="text-sm text-gray-500">Monday – Saturday: 8 AM – 8 PM</p>
                <p className="text-sm text-gray-500">Sunday: 9 AM – 5 PM</p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <div className="card p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Kumar" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="input-field resize-none" placeholder="Write your message here..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                    <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
