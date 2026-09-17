import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';
import { fetchMenu } from '../services/api';

const CATEGORIES = ['All', 'Tacos', 'Chai', 'Sandwiches', 'Pizza', 'Confectionery'];

const CAT_EMOJI = {
  All: '🍽️', Tacos: '🌮', Chai: '🍵', Sandwiches: '🥪', Pizza: '🍕', Confectionery: '🍰'
};

const INITIAL_FALLBACK_MENU = [
  // Tacos & Burritos
  { _id: '1', name: 'Crispy Veg Taco (2 pcs)', description: 'Crispy taco shell loaded with spiced beans, fresh salsa, corn & cheese', price: 79, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400', popular: true, available: true },
  { _id: '2', name: 'Paneer Tikka Taco (2 pcs)', description: 'Smoky grilled paneer tikka with mint mayo & chipotle salsa in soft taco shells', price: 99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', popular: true, available: true },
  { _id: '3', name: 'Cheesy Fiesta Burrito', description: 'Warm flour tortilla stuffed with Mexican rice, beans, jalapeños & molten cheese', price: 119, category: 'Tacos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', popular: true, available: true },
  { _id: '4', name: 'Loaded Nacho Bowl', description: 'Crunchy tortilla chips topped with cheese sauce, pico de gallo & sour cream', price: 89, category: 'Tacos', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', popular: true, available: true },

  // Chai & Drinks
  { _id: '5', name: 'Masala Chai', description: 'Spiced Indian tea with ginger, cardamom & milk', price: 15, category: 'Chai', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', popular: true, available: true },
  { _id: '6', name: 'Cutting Chai', description: 'Strong half-cup tea, Mumbai style', price: 10, category: 'Chai', image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=400', popular: true, available: true },
  { _id: '7', name: 'Mexican Cold Coffee', description: 'Chilled espresso blended with dark chocolate & cinnamon hint', price: 69, category: 'Chai', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400', popular: true, available: true },
  { _id: '8', name: 'Adrak Chai', description: 'Ginger-packed chai for cold mornings', price: 15, category: 'Chai', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', popular: true, available: true },
  { _id: '9', name: 'Lemon Mint Ice Tea', description: 'Chilled black tea with fresh lemon & crushed mint', price: 49, category: 'Chai', available: true },

  // Sandwiches
  { _id: '10', name: 'Veg Club Sandwich', description: 'Triple layer sandwich with veggies, cheese & chutney', price: 60, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400', popular: true, available: true },
  { _id: '11', name: 'Paneer Tikka Sandwich', description: 'Grilled paneer with spiced mayo & veggies', price: 75, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', popular: true, available: true },
  { _id: '12', name: 'Mexican Chipotle Sandwich', description: 'Bell peppers, sweet corn, chipotle sauce & melted cheese', price: 79, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },
  { _id: '13', name: 'Corn Cheese Sandwich', description: 'Sweet corn with melted cheese — student favourite', price: 55, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },

  // Pizza
  { _id: '14', name: 'Margherita Pizza', description: 'Classic tomato sauce with fresh mozzarella & basil', price: 120, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', popular: true, available: true },
  { _id: '15', name: 'Taco Town Special Pizza', description: 'Mexican spiced veggies, paneer, jalapeños & salsa drip', price: 159, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', popular: true, available: true },
  { _id: '16', name: 'Corn Capsicum Pizza', description: 'Sweet corn & capsicum with rich tomato sauce', price: 130, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', available: true },
  { _id: '17', name: 'BBQ Veggie Pizza', description: 'Smoky BBQ sauce with grilled veggies & extra cheese', price: 159, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', available: true },

  // Confectionery
  { _id: '18', name: 'Chocolate Brownie', description: 'Fudgy, gooey chocolate brownie — warm & fresh', price: 45, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', popular: true, available: true },
  { _id: '19', name: 'Churros with Chocolate Dip', description: 'Crispy cinnamon churros served warm with dark chocolate dip', price: 69, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1624371414361-e670ef48e89f?w=400', popular: true, available: true },
  { _id: '20', name: 'Cake Slice', description: 'Rich vanilla or chocolate cake slice with frosting', price: 55, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true },
  { _id: '21', name: 'Samosa (2 pcs)', description: 'Crispy fried samosas with tamarind chutney', price: 20, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', available: true },
];

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [allItems, setAllItems] = useState(INITIAL_FALLBACK_MENU);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [search, setSearch] = useState('');

  // Keep active category in sync with URL search params
  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // Load full menu once from server to sync latest items
  useEffect(() => {
    const loadAllMenu = async () => {
      try {
        const res = await fetchMenu();
        const dataList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        if (dataList && dataList.length > 0) {
          setAllItems(dataList);
        }
      } catch (err) {
        console.warn('Using initial fallback menu array:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllMenu();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearch('');
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  // Filter available items by selected category
  const availableItems = allItems.filter(item => item.available !== false);

  const categoryFiltered = activeCategory === 'All'
    ? availableItems
    : availableItems.filter(item => item.category === activeCategory);

  const filtered = search
    ? categoryFiltered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      )
    : categoryFiltered;

  return (
    <main className="flex-1 pb-24" id="menu-page">
      {/* Header */}
      <div className="bg-white border-b border-cafe-border sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
            <input
              type="text"
              placeholder="Search tacos, chai, pizza, sandwiches..."
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
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-cafe-bg text-cafe-muted hover:bg-cafe-border hover:text-secondary'
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
        {!loading && (
          <p className="text-cafe-muted text-sm mb-4 font-medium flex items-center justify-between">
            <span>Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in ${activeCategory}` : 'on the menu'}</span>
            {search && (
              <button onClick={() => setSearch('')} className="text-primary hover:underline text-xs">
                Clear search
              </button>
            )}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-cafe-muted">Loading menu...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-cafe-border p-8">
                <p className="text-5xl mb-3">🌮</p>
                <p className="font-display font-bold text-secondary text-lg">No items found</p>
                <p className="text-cafe-muted text-sm mt-1">Try selecting another category or clear your search query.</p>
                <button onClick={() => { handleCategoryChange('All'); setSearch(''); }} className="btn-primary text-sm mt-4 py-2 px-4">
                  View Full Menu
                </button>
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
