const express = require('express');
const {
  CreateOrder,
  ConfirmPayment,
  GetMyOrders,
  GetVendorOrders,
  UpdateOrderStatus,
} = require('../Controller/OrderController');
const { authMiddleware } = require('../Midleware/AuthMilderware');
const { vendorAuthMiddleware } = require('../Midleware/VendorAuthMiddleware');

const router = express.Router();

// User routes
router.post('/', authMiddleware, CreateOrder);                         // place order
router.get('/my', authMiddleware, GetMyOrders);                       // user's order history
router.post('/payment/confirm', authMiddleware, ConfirmPayment);      // confirm Razorpay payment

// Vendor routes
router.get('/vendor', vendorAuthMiddleware, GetVendorOrders);                             // list orders for vendor
router.patch('/:orderNumber/status', vendorAuthMiddleware, UpdateOrderStatus);            // update order status

module.exports = router;
