const express = require('express');
const router = express.Router();
const {
  createOrder, getOrders, getOrder, updateOrderStatus, getStats
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', createOrder);
router.get('/stats', auth, getStats);
router.get('/', auth, getOrders);
router.get('/:id', getOrder);
router.put('/:id', auth, updateOrderStatus);

module.exports = router;
