const Menu = require('../models/Menu');

const menuItems = [
  // ---- TACOS & BURRITOS ----
  { name: 'Crispy Veg Taco (2 pcs)', description: 'Crispy taco shell loaded with spiced beans, fresh salsa, corn & cheese', price: 79, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400', popular: true, available: true },
  { name: 'Paneer Tikka Taco (2 pcs)', description: 'Smoky grilled paneer tikka with mint mayo & chipotle salsa in soft taco shells', price: 99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', popular: true, available: true },
  { name: 'Cheesy Fiesta Burrito', description: 'Warm flour tortilla stuffed with Mexican rice, beans, jalapeños & molten cheese', price: 119, category: 'Tacos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', popular: true, available: true },
  { name: 'Loaded Nacho Bowl', description: 'Crunchy tortilla chips topped with cheese sauce, pico de gallo & sour cream', price: 89, category: 'Tacos', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', popular: true, available: true },

  // ---- CHAI & DRINKS ----
  { name: 'Masala Chai', description: 'Spiced Indian tea with ginger, cardamom & milk', price: 15, category: 'Chai', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', popular: true, available: true },
  { name: 'Cutting Chai', description: 'Strong half-cup tea, Mumbai style', price: 10, category: 'Chai', image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=400', popular: true, available: true },
  { name: 'Mexican Cold Coffee', description: 'Chilled espresso blended with dark chocolate & cinnamon hint', price: 69, category: 'Chai', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400', popular: true, available: true },
  { name: 'Adrak Chai', description: 'Ginger-packed chai for cold mornings', price: 15, category: 'Chai', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', popular: true, available: true },
  { name: 'Lemon Mint Ice Tea', description: 'Chilled black tea with fresh lemon & crushed mint', price: 49, category: 'Chai', available: true },

  // ---- SANDWICHES ----
  { name: 'Veg Club Sandwich', description: 'Triple layer sandwich with veggies, cheese & chutney', price: 60, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400', popular: true, available: true },
  { name: 'Paneer Tikka Sandwich', description: 'Grilled paneer with spiced mayo & veggies', price: 75, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', popular: true, available: true },
  { name: 'Mexican Chipotle Sandwich', description: 'Bell peppers, sweet corn, chipotle sauce & melted cheese', price: 79, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },
  { name: 'Corn Cheese Sandwich', description: 'Sweet corn with melted cheese — student favourite', price: 55, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },

  // ---- PIZZA ----
  { name: 'Margherita Pizza', description: 'Classic tomato sauce with fresh mozzarella & basil', price: 120, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', popular: true, available: true },
  { name: 'Taco Town Special Pizza', description: 'Mexican spiced veggies, paneer, jalapeños & salsa drip', price: 159, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', popular: true, available: true },
  { name: 'Corn Capsicum Pizza', description: 'Sweet corn & capsicum with rich tomato sauce', price: 130, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', available: true },
  { name: 'BBQ Veggie Pizza', description: 'Smoky BBQ sauce with grilled veggies & extra cheese', price: 159, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', available: true },

  // ---- CONFECTIONERY ----
  { name: 'Chocolate Brownie', description: 'Fudgy, gooey chocolate brownie — warm & fresh', price: 45, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', popular: true, available: true },
  { name: 'Churros with Chocolate Dip', description: 'Crispy cinnamon churros served warm with dark chocolate dip', price: 69, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1624371414361-e670ef48e89f?w=400', popular: true, available: true },
  { name: 'Cake Slice', description: 'Rich vanilla or chocolate cake slice with frosting', price: 55, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true },
  { name: 'Samosa (2 pcs)', description: 'Crispy fried samosas with tamarind chutney', price: 20, category: 'Confectionery', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', available: true },
];

async function seedData() {
  await Menu.deleteMany({});
  await Menu.insertMany(menuItems);
  return menuItems.length;
}

module.exports = seedData;
