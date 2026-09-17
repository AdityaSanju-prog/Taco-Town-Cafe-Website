import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, RefreshCw, Loader2, X
} from 'lucide-react';
import { fetchAdminMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

const CATEGORIES = ['Tacos', 'Chai', 'Sandwiches', 'Pizza', 'Confectionery'];

const CATEGORY_IMAGES = {
  Tacos: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
  Chai: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
  Sandwiches: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
  Pizza: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400',
  Confectionery: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
};

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Tacos', image: '', available: true, popular: false
  });
  const [saving, setSaving] = useState(false);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminMenu();
      const dataList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setItems(dataList);
    } catch (err) {
      console.error('Failed to load admin menu:', err);
      toast.error('Failed to load admin menu from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category || 'Tacos',
        image: item.image || '',
        available: item.available !== false,
        popular: !!item.popular
      });
    } else {
      setEditingItem(null);
      setForm({ name: '', description: '', price: '', category: 'Tacos', image: '', available: true, popular: false });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Please fill required fields (Name, Price, Category)');
      return;
    }

    const itemData = {
      ...form,
      price: Number(form.price),
      image: form.image || CATEGORY_IMAGES[form.category] || CATEGORY_IMAGES.Tacos
    };

    setSaving(true);
    try {
      if (editingItem) {
        const res = await updateMenuItem(editingItem._id, itemData);
        const updated = res.data?.data || res.data || itemData;
        setItems(prev => prev.map(i => i._id === editingItem._id ? { ...i, ...updated } : i));
        toast.success('Item updated successfully');
      } else {
        const res = await createMenuItem(itemData);
        const created = res.data?.data || res.data || { _id: Date.now().toString(), ...itemData };
        setItems(prev => [created, ...prev]);
        toast.success('Item created successfully');
      }
      closeModal();
    } catch (err) {
      console.error('Save item error:', err);
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id);
        toast.success('Item deleted');
        setItems(prev => prev.filter(i => i._id !== id));
      } catch (err) {
        console.error('Delete item error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const toggleAvailability = async (item) => {
    const newStatus = !item.available;
    // Optimistic local UI update
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, available: newStatus } : i));

    try {
      await updateMenuItem(item._id, { available: newStatus });
      toast.success(`${item.name} is now ${newStatus ? 'Available' : 'Out of Stock'}`);
    } catch (err) {
      console.error('Toggle availability error:', err);
      toast.error('Failed to update stock status on server');
    }
  };

  return (
    <AdminLayout title="Menu Management">
      {/* Top Header */}
      <div className="bg-white border-b border-cafe-border px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display font-bold text-lg md:text-xl text-secondary">Menu Management</h1>
          <p className="text-cafe-muted text-xs">Add, edit, or toggle stock availability of menu items</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadMenu} className="p-2 rounded-lg hover:bg-cafe-bg text-cafe-muted hover:text-secondary">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => openModal()} className="btn-primary text-xs md:text-sm py-2 px-3 md:px-4 flex items-center gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item._id} className={`card p-4 flex gap-3 transition-all ${!item.available ? 'opacity-70 bg-gray-50 border-gray-200' : 'hover:shadow-card-hover'}`}>
                <img
                  src={item.image || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.Tacos}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-cafe-border"
                  onError={(e) => { e.target.onerror = null; e.target.src = CATEGORY_IMAGES.Tacos; }}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1 mb-0.5">
                      <h3 className="font-display font-semibold text-secondary text-sm truncate">{item.name}</h3>
                      <span className="font-bold text-primary text-sm flex-shrink-0">₹{item.price}</span>
                    </div>
                    <p className="text-[11px] text-cafe-muted line-clamp-1">{item.category} · {item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-cafe-border">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                        item.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {item.available ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </button>
                    <div className="ml-auto flex items-center gap-1">
                      <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-cafe-border flex justify-between items-center bg-cafe-bg">
              <h2 className="font-display font-bold text-secondary text-base">{editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}</h2>
              <button onClick={closeModal} className="p-1 text-cafe-muted hover:text-secondary rounded-full hover:bg-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-cafe-text mb-1 block">Item Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field py-2 text-sm" placeholder="e.g. Crispy Veg Taco" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-cafe-text mb-1 block">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field py-2 text-sm" placeholder="79" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-cafe-text mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-cafe-text mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field py-2 text-sm resize-none" rows="2" placeholder="Item description..." />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-cafe-text mb-1 block">Image URL (Optional)</label>
                  <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field py-2 text-sm" placeholder="https://..." />
                </div>
                <div className="col-span-2 flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                    Available (In Stock)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input type="checkbox" checked={form.popular} onChange={e => setForm({...form, popular: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                    Popular / Featured
                  </label>
                </div>
              </div>
              <div className="pt-3 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 btn-outline py-2 text-xs">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMenu;
