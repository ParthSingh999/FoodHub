const db = require('./Confiq/db');
const Order = require('./Models/OrderModel');
const OrderItem = require('./Models/OrderItemModel');

async function main() {
  try {
    await db.authenticate();
    console.log('Database connected successfully.');

    // Delete all OrderItems
    const deletedItems = await OrderItem.destroy({ where: {} });
    console.log(`Deleted ${deletedItems} order items.`);

    // Delete all Orders
    const deletedOrders = await Order.destroy({ where: {} });
    console.log(`Deleted ${deletedOrders} orders.`);

    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

main();
