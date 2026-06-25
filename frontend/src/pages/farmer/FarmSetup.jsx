import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { farmAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const FARM_TYPES = [
  { val: 'home_garden',      label: '🏡 Home Garden' },
  { val: 'terrace_garden',   label: '🌿 Terrace Garden' },
  { val: 'small_farm',       label: '🌾 Small Farm' },
  { val: 'community_garden', label: '👥 Community Garden' },
]

export default function FarmSetup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [isEdit,  setIsEdit]  = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', farmType: 'home_garden',
    'location.address': '', 'location.city': '', 'location.state': 'Karnataka', 'location.pincode': '',
    isOrganic: false, isNaturallyGrown: true, practicesSummary: '',
  })

  useEffect(() => {
    farmAPI.getMine()
      .then(res => {
        const f = res.data.farm
        setForm({
          name: f.name || '', description: f.description || '', farmType: f.farmType || 'home_garden',
          'location.address': f.location?.address || '', 'location.city': f.location?.city || '',
          'location.state': f.location?.state || 'Karnataka', 'location.pincode': f.location?.pincode || '',
          isOrganic: f.isOrganic || false, isNaturallyGrown: f.isNaturallyGrown !== false,
          practicesSummary: f.practicesSummary || '',
        })
        setIsEdit(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form['location.city']) return toast.error('Name and city are required')
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      isEdit ? await farmAPI.update(fd) : await farmAPI.create(fd)
      toast.success(isEdit ? 'Farm profile updated!' : 'Farm profile created!')
      navigate('/farmer')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner fullPage />

  return (
    <div className="page-container py-8 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900 mb-2">{isEdit ? 'Edit' : 'Setup'} Farm Profile</h1>
      <p className="text-gray-500 mb-8">This is what customers will see when they visit your farm page</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Farm / Garden Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Krishna's Terrace Garden" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Farm Type</label>
              <div className="grid grid-cols-2 gap-3">
                {FARM_TYPES.map(t => (
                  <label key={t.val} className={`p-3 border-2 rounded-xl cursor-pointer text-sm font-medium text-center transition-all ${form.farmType === t.val ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                    <input type="radio" name="farmType" value={t.val} checked={form.farmType === t.val} onChange={handleChange} className="hidden" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">About Your Farm</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Tell customers about your garden..." />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['location.address', 'Street Address'], ['location.city', 'City *'], ['location.state', 'State'], ['location.pincode', 'Pincode']].map(([name, label]) => (
              <div key={name} className={name === 'location.address' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input name={name} value={form[name]} onChange={handleChange} className="input-field" placeholder={label} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Growing Practices</h2>
          <div className="space-y-3 mb-4">
            {[['isNaturallyGrown', '🌿 Naturally Grown (no synthetic fertilisers)'], ['isOrganic', '✅ Certified / Self-declared Organic']].map(([name, label]) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-5 h-5 accent-green-600" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Practices Summary (shown to customers)</label>
            <textarea name="practicesSummary" value={form.practicesSummary} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="e.g. We use compost, avoid pesticides, water with drip irrigation..." />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full btn-primary py-4 text-base font-bold disabled:opacity-60">
          {saving ? 'Saving...' : isEdit ? 'Update Farm Profile' : 'Create Farm Profile'}
        </button>
      </form>
    </div>
  )
}
