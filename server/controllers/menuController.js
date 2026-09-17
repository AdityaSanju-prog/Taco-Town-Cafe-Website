const Menu = require('../models/Menu');

const DEFAULT_MENU_ITEMS = [
  // ---- TACOS & BURRITOS ----
  { _id: '1', name: 'Crispy Veg Taco (2 pcs)', description: 'Crispy taco shell loaded with spiced beans, fresh salsa, corn & cheese', price: 79, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400', popular: true, available: true },
  { _id: '2', name: 'Paneer Tikka Taco (2 pcs)', description: 'Smoky grilled paneer tikka with mint mayo & chipotle salsa in soft taco shells', price: 99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', popular: true, available: true },
  { _id: '3', name: 'Cheesy Fiesta Burrito', description: 'Warm flour tortilla stuffed with Mexican rice, beans, jalapeños & molten cheese', price: 119, category: 'Tacos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', popular: true, available: true },
  { _id: '4', name: 'Loaded Nacho Bowl', description: 'Crunchy tortilla chips topped with cheese sauce, pico de gallo & sour cream', price: 89, category: 'Tacos', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', popular: true, available: true },

  // ---- CHAI & DRINKS ----
  { _id: '5', name: 'Masala Chai', description: 'Spiced Indian tea with ginger, cardamom & milk', price: 15, category: 'Chai', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', popular: true, available: true },
  { _id: '6', name: 'Cutting Chai', description: 'Strong half-cup tea, Mumbai style', price: 10, category: 'Chai', image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=400', popular: true, available: true },
  { _id: '7', name: 'Mexican Cold Coffee', description: 'Chilled espresso blended with dark chocolate & cinnamon hint', price: 69, category: 'Chai', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400', popular: true, available: true },
  { _id: '8', name: 'Adrak Chai', description: 'Ginger-packed chai for cold mornings', price: 15, category: 'Chai', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', popular: true, available: true },
  { _id: '9', name: 'Lemon Mint Ice Tea', description: 'Chilled black tea with fresh lemon & crushed mint', price: 49, category: 'Chai', available: true },

  // ---- SANDWICHES ----
  { _id: '10', name: 'Veg Club Sandwich', description: 'Triple layer sandwich with veggies, cheese & chutney', price: 60, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400', popular: true, available: true },
  { _id: '11', name: 'Paneer Tikka Sandwich', description: 'Grilled paneer with spiced mayo & veggies', price: 75, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', popular: true, available: true },
  { _id: '12', name: 'Mexican Chipotle Sandwich', description: 'Bell peppers, sweet corn, chipotle sauce & melted cheese', price: 79, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },
  { _id: '13', name: 'Corn Cheese Sandwich', description: 'Sweet corn with melted cheese — student favourite', price: 55, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },

  // ---- PIZZA ----
  { _id: '14', name: 'Margherita Pizza', description: 'Classic tomato sauce with fresh mozzarella & basil', price: 120, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', popular: true, available: true },
  { _id: '15', name: 'Taco Town Special Pizza', description: 'Mexican spiced veggies, paneer, jalapeños & salsa drip', price: 159, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', popular: true, available: true },
  { _id: '16', name: 'Corn Capsicum Pizza', description: 'Sweet corn & capsicum with rich tomato sauce', price: 130, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', available: true },
  { _id: '17', name: 'BBQ Veggie Pizza', description: 'Smoky BBQ sauce with grilled veggies & extra cheese', price: 159, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', available: true },

  // ---- CONFECTIONERY ----
  { _id: '18', name: 'Chocolate Brownie', description: 'Fudgy, gooey chocolate brownie — warm & fresh', price: 45, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', popular: true, available: true },
  { _id: '19', name: 'Churros with Chocolate Dip', description: 'Crispy cinnamon churros served warm with dark chocolate dip', price: 69, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1624371414361-e670ef48e89f?w=400', popular: true, available: true },
  { _id: '20', name: 'Cake Slice', description: 'Rich vanilla or chocolate cake slice with frosting', price: 55, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true },
  { _id: '21', name: 'Samosa (2 pcs)', description: 'Crispy fried samosas with tamarind chutney', price: 20, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', available: true },
];

let inMemoryMenu = [...DEFAULT_MENU_ITEMS];

// GET /api/menu — all items, optional ?category=Chai
exports.getMenu = async (req, res) => {
  try {
    const filter = { available: true };
    if (req.query.category) filter.category = req.query.category;
    let items = [];
    try {
      items = await Menu.find(filter).sort({ popular: -1, name: 1 });
    } catch {
      // fallback
    }

    if (!items || items.length === 0) {
      items = inMemoryMenu.filter(i => i.available && (!req.query.category || i.category === req.query.category));
    }

    res.json({ success: true, data: items });
  } catch (err) {
    res.json({ success: true, data: inMemoryMenu });
  }
};

// GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    let item = null;
    try {
      item = await Menu.findById(req.params.id);
    } catch {
      // fallback
    }
    if (!item) {
      item = inMemoryMenu.find(i => i._id === req.params.id);
    }
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/menu/admin/all — all items including unavailable (admin)
exports.getAllMenuAdmin = async (req, res) => {
  try {
    let items = [];
    try {
      items = await Menu.find().sort({ category: 1, name: 1 });
    } catch {
      // fallback
    }
    if (!items || items.length === 0) {
      items = inMemoryMenu;
    }
    res.json({ success: true, data: items });
  } catch (err) {
    res.json({ success: true, data: inMemoryMenu });
  }
};

// POST /api/menu — create new item (admin)
exports.createMenuItem = async (req, res) => {
  try {
    let item;
    try {
      item = new Menu(req.body);
      await item.save();
    } catch {
      item = { _id: Date.now().toString(), ...req.body, available: true };
      inMemoryMenu.push(item);
    }
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/menu/:id — update item (admin)
exports.updateMenuItem = async (req, res) => {
  try {
    let item = null;
    try {
      item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    } catch {
      // fallback
    }
    if (!item) {
      const idx = inMemoryMenu.findIndex(i => i._id === req.params.id);
      if (idx !== -1) {
        inMemoryMenu[idx] = { ...inMemoryMenu[idx], ...req.body };
        item = inMemoryMenu[idx];
      }
    }
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/menu/:id — delete item (admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    try {
      await Menu.findByIdAndDelete(req.params.id);
    } catch {
      inMemoryMenu = inMemoryMenu.filter(i => i._id !== req.params.id);
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
