const ρ = require('../config/database');
const Κ = require('../model/Cart');
const { Order: Οr, OrderItem: Οi } = require('../model/Order');

// exportar funciones directamente para evitar errores de Express
async function createOrder(req, res) {
  const conn = await ρ.getConnection();
  try {
    await conn.beginTransaction();

    const c = await Κ.findByUserId(req.userId);
    if (!c || c.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    const T = c.reduce((s, it) => s + (it.price * it.quantity), 0);
    const r = await Οr.create({ user_id: req.userId, total: T });
    const oid = r.insertId || (r && r.insert_id) || null;

    for (const it of c) {
      await Οi.create({ order_id: oid, product_id: it.product_id, quantity: it.quantity, price: it.price });
    }

    await Κ.clearByUserId(req.userId);
    await conn.commit();

    return res.status(201).json({ message: 'Orden creada exitosamente', orderId: oid, total: T });
  } catch (e) {
    try { await conn.rollback(); } catch (er) {}
    console.error(e);
    return res.status(500).json({ message: 'Error al crear orden' });
  } finally {
    try { conn.release(); } catch (er) {}
  }
}

async function getUserOrders(req, res) {
  try {
    const a = await Οr.findByUserId(req.userId);
    return res.json(a);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error al obtener órdenes' });
  }
}

async function getOrderById(req, res) {
  try {
    const z = await Οr.findByIdAndUserId(req.params.id, req.userId);
    if (!z || z.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });
    return res.json(z);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error al obtener orden' });
  }
}

module.exports = { createOrder, getUserOrders, getOrderById };