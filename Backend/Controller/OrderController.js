const Order = require('../Models/OrderModel');
const OrderItem = require('../Models/OrderItemModel');
const Product = require('../Models/ProductModel');
const Vendor = require('../Models/VendorModel');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'demo_secret';
const RAZORPAY_ENABLED = process.env.RAZORPAY_ENABLED === 'true';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const memoryOrders = [];

const isDbUnavailableError = (error) => {
  const message = error?.message || '';
  return (
    error?.name === 'SequelizeConnectionError' ||
    error?.name === 'SequelizeAccessDeniedError' ||
    message.includes('Access denied') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND') ||
    message.includes('connect')
  );
};

function statusToClient(status) {
  if (status === 'on_the_way') return 'on-the-way';
  if (status === 'pending') return 'preparing';
  return status;
}

function formatOrder(order) {
  return {
    id: order.orderNumber,
    restaurantName: order.vendor ? order.vendor.restaurantName : '',
    vendorId: order.vendorId,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: order.total,
    status: statusToClient(order.status),
    date: order.createdAt instanceof Date ? order.createdAt.toISOString().split('T')[0] : String(order.createdAt).split('T')[0],
    address: order.address,
    paymentMode: order.paymentMode,
    tip: order.tip || 0,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    taxes: order.taxes,
    discount: order.discount,
  };
}

function formatMemoryOrder(order) {
  return {
    id: order.orderNumber,
    restaurantName: order.vendor ? order.vendor.restaurantName : '',
    vendorId: order.vendorId,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: order.total,
    status: statusToClient(order.status),
    date: order.createdAt instanceof Date ? order.createdAt.toISOString().split('T')[0] : String(order.createdAt).split('T')[0],
    address: order.address,
    paymentMode: order.paymentMode,
    tip: order.tip || 0,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    taxes: order.taxes,
    discount: order.discount,
  };
}

async function CreateOrder(req, res) {
  try {
    const { items, address, paymentMode = 'COD', deliveryFee = 40, discount = 0, tip = 0, paymentDetails, restaurantName, vendorId } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !address) {
      return res.status(400).json({ error: 'Items and delivery address are required' });
    }

    // Try DB first
    try {
      const productIds = items.map((item) => Number(item.productId));
      const products = await Product.findAll({ where: { id: productIds }, include: [{ model: Vendor, as: 'vendor' }] });
      
      if (products.length === items.length) {
        const vendorIds = [...new Set(products.map((product) => product.vendorId))];
        if (vendorIds.length !== 1) {
          return res.status(400).json({ error: 'Please order from one restaurant at a time' });
        }

        const subtotal = items.reduce((sum, item) => {
          const product = products.find((p) => p.id === Number(item.productId));
          return sum + product.price * Number(item.quantity);
        }, 0);
        const taxes = Math.round(subtotal * 0.05);
        const total = subtotal + Number(deliveryFee) + taxes + Number(tip) - Number(discount);

        const order = await Order.create({
          orderNumber: `ORD${Date.now()}`,
          userId: req.user.id,
          vendorId: vendorIds[0],
          address,
          subtotal,
          deliveryFee,
          taxes,
          discount,
          tip,
          total,
          paymentMode,
          status: paymentMode === 'ONLINE' ? 'pending' : 'preparing',
        });

        await Promise.all(items.map((item) => {
          const product = products.find((p) => p.id === Number(item.productId));
          return OrderItem.create({
            orderId: order.id,
            productId: product.id,
            name: product.name,
            quantity: Number(item.quantity),
            price: product.price,
          });
        }));

        const created = await Order.findByPk(order.id, {
          include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }],
        });

        if (paymentMode === 'ONLINE') {
          let paymentPayload = null;

          if (RAZORPAY_ENABLED) {
            try {
              const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(total * 100),
                currency: 'INR',
                receipt: created.orderNumber,
                notes: {
                  orderId: created.orderNumber,
                  userId: req.user.id,
                },
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
              return res.status(500).json({ error: `Payment gateway error: ${paymentError.message}` });
            }
          } else {
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

          return res.status(201).json({
            ...formatOrder(created),
            payment: paymentPayload,
          });
        }

        return res.status(201).json(formatOrder(created));
      }
    } catch (dbError) {
      if (!isDbUnavailableError(dbError)) {
        throw dbError;
      }
      // Fall through to in-memory fallback
    }

    // In-memory fallback
    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price * Number(item.quantity);
    }, 0);
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + Number(deliveryFee) + taxes + Number(tip) - Number(discount);

    const memoryOrder = {
      id: `MEM${Date.now()}`,
      orderNumber: `ORD${Date.now()}`,
      userId: req.user.id,
      vendorId: vendorId || '1',
      address,
      subtotal,
      deliveryFee,
      taxes,
      discount,
      tip,
      total,
      paymentMode,
      status: paymentMode === 'ONLINE' ? 'pending' : 'preparing',
      createdAt: new Date(),
      vendor: {
        restaurantName: restaurantName || 'Selected Restaurant',
      },
      items: items.map((item) => ({
        name: item.name || 'Food Item',
        quantity: Number(item.quantity),
        price: Number(item.price) || 0,
      })),
    };

    memoryOrders.unshift(memoryOrder);

    if (paymentMode === 'ONLINE') {
      const paymentPayload = {
        key: RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        orderId: memoryOrder.orderNumber,
        name: 'Zamato Clone',
        description: 'Food order payment',
        prefill: {
          name: 'Customer',
          email: paymentDetails?.email || 'customer@example.com',
          contact: '9999999999',
        },
      };

      return res.status(201).json({
        ...formatMemoryOrder(memoryOrder),
        payment: paymentPayload,
      });
    }

    return res.status(201).json(formatMemoryOrder(memoryOrder));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function ConfirmPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: 'Payment details are required' });
    }

    // Check memory orders first
    const memOrder = memoryOrders.find((o) => o.orderNumber === orderId);
    if (memOrder) {
      memOrder.status = 'preparing';
      memOrder.paymentMode = 'ONLINE';
      return res.json({ message: 'Payment confirmed', order: formatMemoryOrder(memOrder) });
    }

    const order = await Order.findOne({ where: { orderNumber: orderId } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    await order.update({ status: 'preparing', paymentMode: 'ONLINE' });

    res.json({ message: 'Payment confirmed', order: formatOrder(await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }] })) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function GetMyOrders(req, res) {
  try {
    let dbOrders = [];
    try {
      dbOrders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }],
        order: [['createdAt', 'DESC']],
      });
    } catch (dbError) {
      if (!isDbUnavailableError(dbError)) {
        throw dbError;
      }
    }

    const formattedDbOrders = dbOrders.map(formatOrder);
    const userMemOrders = memoryOrders
      .filter((o) => o.userId === req.user.id)
      .map(formatMemoryOrder);

    // Merge both, memory orders first (since they are newer)
    res.json([...userMemOrders, ...formattedDbOrders]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function GetVendorOrders(req, res) {
  try {
    let dbOrders = [];
    try {
      dbOrders = await Order.findAll({
        where: { vendorId: req.vendor.id },
        include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }],
        order: [['createdAt', 'DESC']],
      });
    } catch (dbError) {
      if (!isDbUnavailableError(dbError)) {
        throw dbError;
      }
    }

    const formattedDbOrders = dbOrders.map(formatOrder);
    const vendorMemOrders = memoryOrders
      .filter((o) => String(o.vendorId) === String(req.vendor.id))
      .map(formatMemoryOrder);

    res.json([...vendorMemOrders, ...formattedDbOrders]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Simple CRUD wrappers to keep compatibility with existing code/tests
async function GetAllOrders(req, res) {
  try {
    const orders = await Order.findAll({ include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }], order: [['createdAt', 'DESC']] });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function GetOrderById(req, res) {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'items' }, { model: Vendor, as: 'vendor' }] });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function UpdateOrder(req, res) {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    await order.update(req.body);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function DeleteOrder(req, res) {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    await order.destroy();
    return res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  CreateOrder,
  ConfirmPayment,
  GetMyOrders,
  GetVendorOrders,
  GetAllOrders,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
};
