import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { productAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const EMPTY = { name: '', category: 'vegetables', price: '', unit: '500g', quantity: '', description: '', harvestDate: '', isOrganic: false, isNaturallyGrown: true, isFreshToday: false, discount: 0 }

export default function FarmerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)

  async function load() {
    setLoading(true)
    productAPI.getMine().then(res => setProducts(res.data.products)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function openAdd()     { setForm(EMPTY); setEditing(null); setModal(true) }
  function openEdit(p)   { setForm({ ...p, harvestDate: p.harvestDate ? p.harvestDate.slice(0, 10) : '' }); setEditing(p._id); setModal(true) }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.quantity) return toast.error('Fill required fields')
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (editing) {
        await productAPI.update(editing, fd)
        toast.success('Product updated!')
      } else {
        await productAPI.create(fd)
        toast.success('Product added!')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    await productAPI.delete(id)
    toast.success('Product removed')
    load()
  }

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Products</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus /> Add Product</button>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🌱</p>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Start adding your fresh produce</p>
          <button onClick={openAdd} className="btn-primary">Add First Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{p.category} · {p.unit}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><FiEdit2 className="text-sm" /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="text-sm" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-green-700">₹{p.price}</span>
                <span className="text-sm text-gray-500">Stock: {p.quantity}</span>
              </div>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {p.isFreshToday    && <span className="badge-fresh text-xs">Fresh Today</span>}
                {p.isOrganic       && <span className="badge-organic text-xs">Organic</span>}
                {p.isNaturallyGrown && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">Natural</span>}
                {!p.isActive       && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Inactive</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX /></button>
              </div>
              <div className="space-y-4">
                {[['name', 'Product Name *'], ['price', 'Price (₹) *'], ['unit', 'Unit (e.g. 500g, bunch) *'], ['quantity', 'Available Quantity *']].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange} className="input-field" type={['price', 'quantity', 'discount'].includes(name) ? 'number' : 'text'} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field bg-white">
                    {['vegetables', 'fruits', 'herbs', 'nuts', 'greens', 'exotic', 'seasonal'].map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Harvest Date</label>
                  <input name="harvestDate" type="date" value={form.harvestDate} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[['isFreshToday', '🌱 Fresh Today'], ['isOrganic', '✅ Organic'], ['isNaturallyGrown', '🌿 Natural']].map(([name, label]) => (
                    <label key={name} className={`flex flex-col items-center gap-1.5 p-3 border-2 rounded-xl cursor-pointer transition-all text-xs font-semibold text-center ${form[name] ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-500'}`}>
                      <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="hidden" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
