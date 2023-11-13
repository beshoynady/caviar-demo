const OrderModel = require('../models/Order.model');

const createOrder = async (req, res) => {
  try {
    const {
      serial,
      ordernum,
      products,
      table,
      user,
      total,
      totalAfterTax,
      order_type,
      notes,
      help,
      employee,
      name,
      phone,
      address,
    } = req.body;

    const newOrder = await OrderModel.create({
      serial,
      ordernum,
      products,
      table,
      user,
      total,
      totalAfterTax,
      order_type,
      notes,
      help,
      employee,
      name,
      phone,
      address,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await OrderModel.findById(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const existingOrder = await OrderModel.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const {
      products,
      tableid,
      userid,
      total,
      totalAfterTax,
      status,
      payment_status,
      isActive,
      isAdd,
      order_type,
      notes,
      waiter,
      help,
      employee,
    } = req.body;

    existingOrder.products = products;
    existingOrder.table = tableid;
    existingOrder.user = userid;
    existingOrder.total = total;
    existingOrder.totalAfterTax = totalAfterTax;
    existingOrder.status = status;
    existingOrder.payment_status = payment_status;
    existingOrder.help = help;
    existingOrder.isActive = isActive;
    existingOrder.isAdd = isAdd;
    existingOrder.employee = employee;
    existingOrder.order_type = order_type;
    existingOrder.notes = notes;
    existingOrder.waiter = waiter;

    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
    if (deletedOrder) {
      res.status(200).json(deletedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
