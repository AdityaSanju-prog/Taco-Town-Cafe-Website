import { Link } from 'react-router-dom';
import { ChevronRight, Clock, MapPin, Tag, Copy, Check, Zap } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CategoryCard from '../components/CategoryCard';
import tacoLogo from '../assets/taco-logo.png';

const CATEGORIES = ['Tacos', 'Chai', 'Sandwiches', 'Pizza', 'Confectionery'];

const OFFERS = [
  {
    id: 'taco-tuesday',
    title: 'Taco Tuesday Special 🌮',
    desc: 'Get 20% OFF on all Taco combos & Loaded Nacho Bowls.',
    code: 'TACO20',
    badge: '20% OFF',
    bg: 'from-amber-500 to-orange-600',
  },
  {
    id: 'student-combo',
    title: 'LPU Student Feast Combo 🎓',
    desc: '2 Crispy Tacos + 1 Cold Coffee / Chai @ just ₹149!',
    code: 'LPUMALL149',
    badge: 'BESTSELLER',
    bg: 'from-red-500 to-pink-600',
  },
  {
    id: 'hostel-night',
    title: 'Hostel Free Express Delivery 🛵',
    desc: 'Free instant room delivery across all LPU Boys & Girls Hostels on orders above ₹199.',
    code: 'HOSTELFREE',
    badge: 'FREE DELIVERY',
    bg: 'from-emerald-500 to-teal-600',
  },
];

const Home = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo Code "${code}" copied to clipboard! 🎉`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <main className="flex-1 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary-lighter text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={tacoLogo}
              alt="Taco Town Logo"
              className="w-12 h-12 object-contain rounded-2xl bg-white/10 p-1 shadow-lg border border-white/20"
            />
            <span className="bg-primary/20 text-primary-100 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-primary/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current text-accent" /> Now Open at Unimall!
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-3">
            Crispy Tacos, Fresh Bites & Chai —
            <br />
            <span className="text-primary">delivered to your Hostel room!</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mb-6">
            Order from <strong>Taco Town Cafe</strong> at LPU Unimall 6th Floor. Quick delivery across all LPU Hostels with student-friendly pricing!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2" id="order-now-btn">
              Order Now <ChevronRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" /> Unimall 6th Floor, LPU
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent" /> 9 AM – 9 PM
              </span>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-cafe-bg" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* Stats Strip */}
      <section className="max-w-5xl mx-auto px-4 py-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Menu Items', value: '25+', icon: '🌮' },
            { label: 'Avg Delivery', value: '15 min', icon: '⚡' },
            { label: 'LPU Students', value: '1000+', icon: '😊' },
          ].map(stat => (
            <div key={stat.label} className="card p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-secondary text-lg leading-none">{stat.value}</div>
              <div className="text-cafe-muted text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 Special Offers & Deals Section */}
      <section className="max-w-5xl mx-auto px-4 py-4" id="offers-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Exclusive Deals
            </span>
            <h2 className="section-title">Special Offers for LPU Students 🔥</h2>
          </div>
          <Link to="/menu" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            Explore Menu <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              className={`bg-gradient-to-br ${offer.bg} text-white rounded-2xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="absolute -right-4 -bottom-4 opacity-20 text-7xl font-bold select-none">
                🌮
              </div>
              <div>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {offer.badge}
                </span>
                <h3 className="font-display font-bold text-lg leading-snug mb-1">{offer.title}</h3>
                <p className="text-white/90 text-xs leading-relaxed mb-4">{offer.desc}</p>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/80 block uppercase tracking-wider">Promo Code</span>
                  <span className="font-mono font-bold text-sm tracking-wider">{offer.code}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="bg-white text-secondary hover:bg-accent font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Browse Categories</h2>
          <Link to="/menu" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat} category={cat} />
          ))}
        </div>
      </section>

      {/* Why Taco Town */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="section-title mb-4">Why LPU Students ❤️ Taco Town</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🌮', title: 'Authentic Tacos & Snacks', desc: 'Crispy tacos, burritos & hot chai under one roof.' },
            { icon: '📍', title: 'Unimall 6th Floor', desc: 'Located right at LPU Unimall 6th Floor for instant pickup & hostel delivery.' },
            { icon: '💸', title: 'Student Deals', desc: 'Tacos start at ₹79. Special hostel combo offers daily.' },
          ].map(item => (
            <div key={item.title} className="card p-5 flex gap-4 items-start hover:shadow-card-hover transition-shadow">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-secondary">{item.title}</h3>
                <p className="text-cafe-muted text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <div className="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
          <p className="font-display font-bold text-xl mb-2 relative z-10">Hungry? Order Taco Town Specials 🚀</p>
          <p className="text-primary-100 text-sm mb-4 relative z-10">Direct Hostel Delivery · Unimall 6th Floor · Cash on Delivery</p>
          <Link to="/menu" className="inline-block bg-white text-primary font-bold py-2.5 px-6 rounded-xl hover:bg-accent hover:text-secondary transition-all duration-200 text-sm relative z-10 cursor-pointer" id="browse-menu-btn">
            Browse Menu →
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
