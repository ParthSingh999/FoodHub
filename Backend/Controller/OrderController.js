require('dotenv').config();
const { Op } = require('sequelize');
const Order = require('../Models/OrderModel');
const OrderItem = require('../Models/OrderItemModel');
const Product = require('../Models/ProductModel');
const Vendor = require('../Models/VendorModel');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'demo_secret';
const RAZORPAY_ENABLED = process.env.RAZORPAY_ENABLED === 'true';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function statusToClient(status) {
  if (status === 'on_the_way') return 'on-the-way';
  if (status === 'pending') return 'preparing';
  return status;
}

function formatOrder(order) {
  return {
    id: order.orderNumber,
    dbId: order.id,
    restaurantName: order.vendor ? order.vendor.restaurantName : '',
    vendorId: order.vendorId,
    items: (order.items || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: order.total,
    status: statusToClient(order.status),
    date:
      order.createdAt instanceof Date
        ? order.createdAt.toISOString().split('T')[0]
        : String(order.createdAt).split('T')[0],
    address: order.address,
    paymentMode: order.paymentMode,
    tip: order.tip || 0,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    taxes: order.taxes,
    discount: order.discount,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// CreateOrder — always persists Order + OrderItems to DB
// ──────────────────────────────────────────────────────────────────────────────

async function CreateOrder(req, res) {
  try {
    const {
      items,
      address,
      paymentMode = 'COD',
      deliveryFee = 40,
      discount = 0,
      tip = 0,
      paymentDetails,
    } = req.body;

    // ── Validate input ────────────────────────────────────────────────────────
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array.' });
    }
    if (!address) {
      return res.status(400).json({ error: 'Delivery address is required.' });
    }

    // Each item must carry { productId, quantity }
    const invalidItem = items.find(
      (i) => !i.productId || !i.quantity || Number(i.quantity) < 1
    );
    if (invalidItem) {
      return res.status(400).json({
        error: 'Each item must have a valid productId and quantity >= 1.',
        invalidItem,
      });
    }

    // ── Fetch products from DB ────────────────────────────────────────────────
    const productIds = items.map((i) => Number(i.productId));
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
      include: [{ model: Vendor, as: 'vendor' }],
    });

    // Check all requested products exist
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      return res.status(400).json({
        error: `Products not found in database: ${missingIds.join(', ')}. Please add products before placing an order.`,
      });
    }

    // Ensure all items belong to the same vendor (single restaurant)
    const vendorIds = [...new Set(products.map((p) => p.vendorId))];
    if (vendorIds.length !== 1) {
      return res.status(400).json({ error: 'Please order from one restaurant at a time.' });
    }

    // ── Calculate totals ──────────────────────────────────────────────────────
    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === Number(item.productId));
      return sum + product.price * Number(item.quantity);
    }, 0);
    const taxes = Math.round(subtotal * 0.05);
    const total =
      subtotal + Number(deliveryFee) + taxes + Number(tip) - Number(discount);

    // ── Persist Order ─────────────────────────────────────────────────────────
    const order = await Order.create({
      orderNumber: `ORD${Date.now()}`,
      userId: req.user.id,
      vendorId: vendorIds[0],
      address,
      subtotal,
      deliveryFee: Number(deliveryFee),
      taxes,
      discount: Number(discount),
      tip: Number(tip),
      total,
      paymentMode,
      status: paymentMode === 'ONLINE' ? 'pending' : 'preparing',
    });

    // ── Persist OrderItems ────────────────────────────────────────────────────
    await Promise.all(
      items.map((item) => {
        const product = products.find((p) => p.id === Number(item.productId));
        return OrderItem.create({
          orderId: order.id,
          productId: product.id,
          name: product.name,
          quantity: Number(item.quantity),
          price: product.price,
        });
      })
    );

    // ── Fetch full order with items for response ───────────────────────────────
    const created = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: Vendor, as: 'vendor' },
      ],
    });

    // ── Handle online payment ─────────────────────────────────────────────────
    if (paymentMode === 'ONLINE') {
      let paymentPayload = null;

      if (RAZORPAY_ENABLED) {
        try {
          const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: created.orderNumber,
            notes: { orderId: created.orderNumber, userId: req.user.id },
          });
          paymentPayload = {
            key: RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderId: razorpayOrder.id,
            name: 'Zamato Clone',
            description: 'Food order payment',
            prefill: {
              name: req.user.name || 'Customer',
              email: paymentDetails?.email || 'customer@example.com',
              contact: req.user.mobile || '9999999999',
            },
          };
        } catch (paymentError) {
          // Order is saved but payment gateway failed — return the order anyway
          console.error('Razorpay error:', paymentError.message);
          return res.status(201).json({
            ...formatOrder(created),
            paymentError: paymentError.message,
          });
        }
      } else {
        // Razorpay disabled (test mode)
        paymentPayload = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(total * 100),
          currency: 'INR',
          orderId: created.orderNumber,
          name: 'Zamato Clone',
          description: 'Food order payment',
          prefill: {
            name: req.user.name || 'Customer',
            email: paymentDetails?.email || 'customer@example.com',
            contact: req.user.mobile || '9999999999',
          },
        };
      }

      return res.status(201).json({ ...formatOrder(created), payment: paymentPayload });
    }

    return res.status(201).json(formatOrder(created));
  } catch (error) {
    console.error('CreateOrder error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// ConfirmPayment
// ──────────────────────────────────────────────────────────────────────────────

async function ConfirmPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: 'Payment details are required.' });
    }

    const order = await Order.findOne({ where: { orderNumber: orderId } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed.' });
    }

    await order.update({ status: 'preparing', paymentMode: 'ONLINE' });

    const updated = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }],
    });

    return res.json({ message: 'Payment confirmed', order: formatOrder(updated) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// GetMyOrders — orders for the logged-in user
// ──────────────────────────────────────────────────────────────────────────────

async function GetMyOrders(req, res) {
  try {
    const dbOrders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Vendor, as: 'vendor' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(dbOrders.map(formatOrder));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// GetVendorOrders — orders for the logged-in vendor
// ──────────────────────────────────────────────────────────────────────────────

async function GetVendorOrders(req, res) {
  try {
    const dbOrders = await Order.findAll({
      where: { vendorId: req.vendor.id },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Vendor, as: 'vendor' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(dbOrders.map(formatOrder));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// UpdateOrderStatus — vendor updates order status
// ──────────────────────────────────────────────────────────────────────────────

async function UpdateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findOne({
      where: { orderNumber: req.params.orderNumber, vendorId: req.vendor.id },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    await order.update({ status });

    const updated = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }],
    });

    return res.json(formatOrder(updated));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { CreateOrder, ConfirmPayment, GetMyOrders, GetVendorOrders, UpdateOrderStatus };
