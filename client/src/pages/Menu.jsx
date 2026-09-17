import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';
import { fetchMenu } from '../services/api';

const CATEGORIES = ['All', 'Tacos', 'Chai', 'Sandwiches', 'Pizza', 'Confectionery'];

const CAT_EMOJI = {
  All: '🍽️', Tacos: '🌮', Chai: '🍵', Sandwiches: '🥪', Pizza: '🍕', Confectionery: '🍰'
};

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [search, setSearch] = useState('');

  // Keep active category in sync with URL search params
  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const cat = activeCategory === 'All' ? null : activeCategory;
        const res = await fetchMenu(cat);
        const dataList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setItems(dataList);
      } catch (err) {
        console.error('Failed to load customer menu:', err);
        setError('Failed to load menu. Please retry.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearch('');
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filtered = search
    ? items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      )
    : items;

  return (
    <main className="flex-1 pb-24" id="menu-page">
      {/* Header */}
      <div className="bg-white border-b border-cafe-border sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
              id="menu-search"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                id={`tab-${cat.toLowerCase()}`}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-cafe-bg text-cafe-muted hover:bg-cafe-border'
                }`}
              >
                <span>{CAT_EMOJI[cat]}</span> {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Count */}
        {!loading && !error && (
          <p className="text-cafe-muted text-sm mb-3">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in ${activeCategory}` : 'available'}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-cafe-muted">Loading menu...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-secondary font-semibold">{error}</p>
            <button onClick={() => setActiveCategory(activeCategory)} className="btn-outline text-sm py-2 px-4">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-3">🔍</p>
                <p className="font-semibold text-secondary">No items found</p>
                <p className="text-cafe-muted text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(item => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Menu;
