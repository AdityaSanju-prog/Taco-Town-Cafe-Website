import { useState } from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const cartItem = items.find(i => i._id === item._id);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300 animate-fade-in" id={`item-${item._id}`}>
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-cafe-border">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'; }}
        />
        {item.popular && (
          <span className="absolute top-2 left-2 bg-accent text-secondary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Popular
          </span>
        )}
        {cartItem && (
          <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            {cartItem.quantity} in cart
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-secondary text-sm leading-tight">{item.name}</h3>
        <p className="text-cafe-muted text-xs mt-1 line-clamp-2 leading-snug">{item.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="font-display font-bold text-primary text-base">₹{item.price}</span>
          <button
            onClick={handleAdd}
            id={`add-${item._id}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-90 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-primary-500 shadow-sm'
            }`}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5" /> Added!</>
            ) : (
              <><Plus className="w-3.5 h-3.5" /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
