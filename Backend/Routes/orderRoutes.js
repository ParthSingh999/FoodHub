const express = require('express');
const {
  CreateOrder,
  ConfirmPayment,
  GetMyOrders,
  GetVendorOrders,
  GetAllOrders,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
} = require('../Controller/OrderController');

const router = express.Router();

router.post('/', CreateOrder);
router.post('/confirm-payment', ConfirmPayment);
router.get('/mine', GetMyOrders);
router.get('/vendor', GetVendorOrders);
router.get('/', GetAllOrders);
router.get('/:id', GetOrderById);
router.put('/:id', UpdateOrder);
router.delete('/:id', DeleteOrder);

module.exports = router;
