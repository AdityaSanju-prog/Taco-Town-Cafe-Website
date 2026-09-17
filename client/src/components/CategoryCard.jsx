import { Link } from 'react-router-dom';

const CATEGORY_META = {
  Tacos: {
    emoji: '🌮',
    gradient: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    desc: 'Crispy tacos & burritos',
  },
  Chai: {
    emoji: '🍵',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    desc: 'Hot & refreshing teas',
  },
  Sandwiches: {
    emoji: '🥪',
    gradient: 'from-green-400 to-emerald-500',
    bg: 'bg-green-50',
    text: 'text-green-700',
    desc: 'Grilled & fresh filled',
  },
  Pizza: {
    emoji: '🍕',
    gradient: 'from-red-400 to-rose-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    desc: 'Freshly baked personal',
  },
  Confectionery: {
    emoji: '🍰',
    gradient: 'from-purple-400 to-pink-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    desc: 'Sweet treats & snacks',
  },
};

const CategoryCard = ({ category }) => {
  const meta = CATEGORY_META[category] || {};

  return (
    <Link
      to={`/menu?category=${category}`}
      className="group block"
      id={`category-${category.toLowerCase()}`}
    >
      <div className="card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1 group-active:scale-95 cursor-pointer">
        <div className={`bg-gradient-to-br ${meta.gradient} p-6 flex flex-col items-center justify-center gap-2 min-h-[120px]`}>
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300 drop-shadow">
            {meta.emoji}
          </span>
        </div>
        <div className="p-3 text-center">
          <h3 className="font-display font-bold text-secondary text-base">{category}</h3>
          <p className="text-cafe-muted text-xs mt-0.5">{meta.desc}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
export { CATEGORY_META };
