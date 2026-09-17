const express = require('express');
const router = express.Router();
const { 
  getMenu, getMenuItem, getAllMenuAdmin, createMenuItem, updateMenuItem, deleteMenuItem 
} = require('../controllers/menuController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getMenu);
router.get('/:id', getMenuItem);

// Admin routes
router.get('/admin/all', auth, getAllMenuAdmin);
router.post('/', auth, createMenuItem);
router.put('/:id', auth, updateMenuItem);
router.delete('/:id', auth, deleteMenuItem);

module.exports = router;
