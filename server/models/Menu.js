const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Tacos', 'Chai', 'Sandwiches', 'Pizza', 'Confectionery'],
    required: true,
  },
  image: { type: String, default: '' },
  available: { type: Boolean, default: true },
  popular: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
