import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, LogOut, Coffee, Menu as MenuIcon,
  Plus, Edit2, Trash2, CheckCircle, XCircle, RefreshCw, Loader2, X
} from 'lucide-react';
import { fetchAdminMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/api';
import toast from 'react-hot-toast';
import tacoLogo from '../../assets/taco-logo.png';

const CATEGORIES = ['Tacos', 'Chai', 'Sandwiches', 'Pizza', 'Confectionery'];

const AdminMenu = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Chai', image: '', available: true, popular: false
  });
  const [saving, setSaving] = useState(false);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminMenu();
      setItems(res.data.data);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('chachu_admin_token');
    navigate('/admin');
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name, description: item.description, price: item.price,
        category: item.category, image: item.image, available: item.available, popular: item.popular
      });
    } else {
      setEditingItem(null);
      setForm({ name: '', description: '', price: '', category: 'Chai', image: '', available: true, popular: false });
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
    setSaving(true);
    try {
      if (editingItem) {
        await updateMenuItem(editingItem._id, form);
        toast.success('Item updated successfully');
      } else {
        await createMenuItem(form);
        toast.success('Item created successfully');
      }
      closeModal();
      loadMenu();
    } catch (err) {
      toast.error('Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
        toast.success('Item deleted');
        setItems(items.filter(i => i._id !== id));
      } catch {
        toast.error('Failed to delete item');
      }
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await updateMenuItem(item._id, { available: !item.available });
      setItems(items.map(i => i._id === item._id ? { ...i, available: !item.available } : i));
      toast.success(`${item.name} is now ${!item.available ? 'Available' : 'Unavailable'}`);
    } catch {
      toast.error('Failed to update availability');
    }
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex" id="admin-menu-page">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 bg-secondary flex-col fixed h-full z-20">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={tacoLogo}
              alt="Taco Town Logo"
              className="w-8 h-8 object-contain rounded-lg bg-white p-0.5"
            />
            <div>
              <p className="font-display font-bold text-white text-sm">Taco Town Admin</p>
              <p className="text-gray-400 text-xs">Café Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-medium text-sm transition-all">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-medium text-sm transition-all">
            <ShoppingBag className="w-4 h-4" /> Orders
          </Link>
          <Link to="/admin/menu" className="flex items-center gap-3 px-3 py-2.5 bg-primary/20 text-primary rounded-xl font-medium text-sm">
            <MenuIcon className="w-4 h-4" /> Menu
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-medium text-sm transition-all w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56">
        <div className="bg-white border-b border-cafe-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-display font-bold text-xl text-secondary">Menu Management</h1>
          <div className="flex gap-3">
            <button onClick={loadMenu} className="p-2 rounded-lg hover:bg-cafe-bg text-cafe-muted hover:text-secondary">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => openModal()} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item._id} className={`card p-4 flex gap-4 transition-all ${!item.available ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-secondary text-sm truncate">{item.name}</h3>
                      <span className="font-bold text-primary text-sm">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-cafe-muted mb-2">{item.category}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleAvailability(item)} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${item.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                        {item.available ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {item.available ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-cafe-border flex justify-between items-center bg-cafe-bg">
              <h2 className="font-display font-bold text-secondary text-lg">{editingItem ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={closeModal} className="p-1 text-cafe-muted hover:text-secondary rounded-full hover:bg-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-cafe-text mb-1 block">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field py-2" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-cafe-text mb-1 block">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field py-2" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-cafe-text mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field py-2">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-cafe-text mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field py-2 resize-none" rows="2" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-cafe-text mb-1 block">Image URL</label>
                  <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field py-2" placeholder="https://..." />
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})} className="w-4 h-4 text-primary" />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.popular} onChange={e => setForm({...form, popular: e.target.checked})} className="w-4 h-4 text-primary" />
                    Popular (Featured)
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 btn-outline py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
