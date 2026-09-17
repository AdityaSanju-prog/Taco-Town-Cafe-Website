const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    hostel: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Delivered'],
    default: 'Pending',
  },
}, { timestamps: true });

// Auto-generate orderId before saving
// Note: In Mongoose 8+, async pre hooks must NOT call next() — just return a promise
orderSchema.pre('save', async function () {
  if (!this.orderId) {
    const count = await this.constructor.countDocuments();
    this.orderId = `TTC-${1000 + count + 1}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
